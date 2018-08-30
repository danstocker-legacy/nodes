import {INode, Port} from "../node";

type StringifierPorts<I> = {
  in: Port<I>,
  out: Port<string>
}

export class Stringifier<I> implements INode {
  public ports: StringifierPorts<I>;

  constructor() {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<string>(this)
    }
  }

  public in(port: Port<I>, value: I): void {
    this.ports.out.out(String(value));
  }
}
