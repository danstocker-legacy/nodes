import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

/**
 * Emits a constant in response to each incoming impulse.
 * @example
 * const emitter = new Emitter<number>(5);
 */
export class Emitter<T> extends Node {
  public readonly in: TStaticInPorts<{
    tag: any
  }>;
  public readonly out: TStaticOutPorts<{
    $: T
  }>;

  private readonly value: any;

  constructor(value: any) {
    super();
    this.value = value;
    this.addPort(new StaticInPort("tag", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.in.tag) {
      this.out.$.send(this.value, tag);
    }
  }
}
