import {
  ErrorSource,
  EventSource,
  IErrorSource,
  IEventSource,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
  TErrorPorts,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

type TInput<T> = T[keyof T];

/**
 * Joins input values bearing the same tag. Produces a dictionary of port
 * name - value pairs.
 * @example
 * let joiner: Joiner<{foo: number, bar: boolean}>;
 * joiner = new Joiner(["foo", "bar"]);
 * joiner.in.foo.send(5, "1");
 * joiner.in.bar.send(true, "1");
 * // joiner.out.$ will output {foo: 5, bar: true} for tag "1"
 */
export class Joiner<T> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<T>;
  public readonly out: TOutPorts<{
    $: T;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  private readonly fields: Array<string>;
  private readonly inputCache: Map<string, T>;
  private readonly portCache: Map<string, Set<string | number>>;

  constructor(fields: Array<string>) {
    Sink.init.call(this, fields);
    Source.init.call(this, ["$"]);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.fields = fields;
    this.inputCache = new Map();
    this.portCache = new Map();
  }

  public send(port: IInPort<TInput<T>>, input: TInput<T>, tag: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      const inputCache = this.inputCache;
      let inputs = inputCache.get(tag);
      if (!inputs) {
        inputs = {} as T;
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
