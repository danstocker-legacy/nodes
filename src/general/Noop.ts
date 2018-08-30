import {INode, Port} from "../node";

type NoopPorts<T> = {
  in: Port<T>,
  out: Port<T>
}

export class Noop<T> implements INode {
  public ports: NoopPorts<T>;

  constructor() {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<T>(this)
    }
  }

  public in(port: Port<T>, value: any): void {
    this.ports.out.out(value);
  }
}
