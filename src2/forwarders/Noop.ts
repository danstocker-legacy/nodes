import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

export class Noop extends Node {
  public readonly in: TStaticInPorts<{
    "$": any
  }>;
  public readonly out: TStaticOutPorts<{
    "$": any
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("$", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send<T>(port: IInPort<T>, value: T, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(value, tag);
    }
  }
}
