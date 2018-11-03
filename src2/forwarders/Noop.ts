import {Node} from "../node";
import {IInPort, IOutPort, StaticPorts} from "../port";
import {StaticInPort} from "../port/StaticInPort";
import {StaticOutPort} from "../port/StaticOutPort";

export class Noop extends Node {
  public readonly in: StaticPorts<IInPort<any>, "$">;
  public readonly out: StaticPorts<IOutPort<any>, "$">;

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
