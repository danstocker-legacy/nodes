import {INode, Port} from "../node";

type MapperCallback<I, O> = (next: I, i: string, node: INode) => O;

export class Mapper<I, O> implements INode {
  public readonly ports: {
    in: Port<I>,
    out: Port<O>
  };
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<O>(this)
    };
    this.callback = callback;
  }

  public in(port: Port<I>, value: I): void {
    if (port === this.ports.in) {
      const source = this.in["source"];
      this.ports.out.out(this.callback(value, source && source.id, this));
    }
  }
}
