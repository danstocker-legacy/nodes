import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

type TInput<T> = T[keyof T];

export class Merger<T> extends Node {
  public readonly in: TStaticInPorts<T>;
  public readonly out: TStaticOutPorts<{
    $: T
  }>;

  private readonly fields: Array<string>;
  private readonly inputCache: Map<string, T>;
  private readonly portCache: Map<string, Set<string | number>>;

  constructor(fields: Array<string>) {
    super();
    this.fields = fields;
    this.inputCache = new Map();
    this.portCache = new Map();
    for (const field of fields) {
      this.addPort(new StaticInPort(field, this));
    }
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U & TInput<T>>, input: U & TInput<T>, tag: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      const inputCache = this.inputCache;
      let inputs = inputCache.get(tag);
      if (!inputs) {
        inputs = <T> {};
        inputCache.set(tag, inputs);
      }

      const portCache = this.portCache;
      let ports = portCache.get(tag);
      if (!ports) {
        ports = new Set(this.fields);
        portCache.set(tag, ports);
      }

      // adding value to input cache
      inputs[name] = input;
      ports.delete(name);

      if (ports.size === 0) {
        // got all inputs for current tag
        // releasing input set and cleaning up
        inputCache.delete(tag);
        portCache.delete(tag);
        this.out.$.send(inputs, tag);
      }
    }
  }
}
