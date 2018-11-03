import {Node} from "../node";
import {
  IInPort,
  IOutPort,
  StaticInPort,
  StaticOutPort,
  TStaticPorts
} from "../port";

export class Noop extends Node {
  public readonly in: TStaticPorts<IInPort<any>, "$">;
  public readonly out: TStaticPorts<IOutPort<any>, "$">;

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
