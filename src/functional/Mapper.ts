import {MapperCallback} from "../typedefs";
import {INode, Port} from "../node";

type MapperPorts<I, O> = {
  in: Port<I>,
  out: Port<O>
}

export class Mapper<I, O> implements INode {
  public ports: MapperPorts<I, O>;

  /**
   * Mapper callback. Similar ro callback passed to Array#map().
   */
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<O>(this)
    };
    this.callback = callback;
  }

  public in(port:Port<I>, value: I): void {
    const source = this.in['source'];
    this.ports.out.out(this.callback(value, source && source.id, this));
  }
}
