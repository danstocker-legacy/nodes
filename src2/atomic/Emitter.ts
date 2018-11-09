import {Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";

/**
 * Emits a constant in response to each incoming impulse.
 * @example
 * const emitter = new Emitter<number>(5);
 */
export class Emitter<T> extends Node {
  public readonly in: TInPorts<{
    tag: any
  }>;
  public readonly out: TOutPorts<{
    $: T
  }>;

  private readonly value: any;

  constructor(value: any) {
    super();
    this.value = value;
    this.addPort(new InPort("tag", this));
    this.addPort(new OutPort("$", this));
  }

  public send(port: IInPort<any>, input: any, tag?: string): void {
    if (port === this.in.tag) {
      this.out.$.send(this.value, tag);
    }
  }
}
