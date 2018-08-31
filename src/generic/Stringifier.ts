import {INode, Port} from "../node";

export class Stringifier<I> implements INode {
  public readonly ports: {
    in: Port<I>,
    out: Port<string>
  };

  constructor() {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<string>(this)
    };
  }

  public in(port: Port<I>, value: I): void {
    if (port === this.ports.in) {
      this.ports.out.out(String(value));
    }
  }
}
