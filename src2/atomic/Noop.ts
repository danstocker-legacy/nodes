import {Node} from "../node";
import {
  IInPort,
  InPort,
  OutPort, TInPorts, TOutPorts
} from "../port";

export class Noop<T> extends Node {
  public readonly in: TInPorts<{
    "$": T
  }>;
  public readonly out: TOutPorts<{
    "$": T
  }>;

  constructor() {
    super();
    this.addPort(new InPort("$", this));
    this.addPort(new OutPort("$", this));
  }

  public send<U>(port: IInPort<U & T>, input: U & T, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(input, tag);
    }
  }
}
