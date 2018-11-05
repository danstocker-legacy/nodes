import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

export class Noop<T> extends Node {
  public readonly in: TStaticInPorts<{
    "$": T
  }>;
  public readonly out: TStaticOutPorts<{
    "$": T
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("$", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U & T>, value: U & T, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(value, tag);
    }
  }
}
