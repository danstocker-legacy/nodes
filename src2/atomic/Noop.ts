import {Node} from "../node";
import {
  IInPort,
  InPort,
  OutPort, TInPorts, TOutPorts
} from "../port";

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.in.$.send(5);
 */
export class Noop<T> extends Node {
  public readonly in: TInPorts<{
    "$": T
  }>;
  public readonly out: TOutPorts<{
    "$": T
  }>;

  constructor() {
    super();
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send<U>(port: IInPort<U & T>, input: U & T, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(input, tag);
    }
  }
}
