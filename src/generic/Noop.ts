import {INode, Port} from "../node";

export class Noop<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<T>
  };

  constructor() {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<T>(this)
    };
  }

  public in(port: Port<T>, value: any): void {
    if (port === this.ports.in) {
      this.ports.out.out(value);
    }
  }
}
