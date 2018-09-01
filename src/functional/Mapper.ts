import {INode, InPort, OutPort} from "../node";

type MapperCallback<I, O> = (next: I, port: InPort<I>, node: INode) => O;

/**
 * Sends mapped input to output.
 */
export class Mapper<I, O> implements INode {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<O>
  };
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.callback = callback;
  }

  public send(port: InPort<I>, value: I): void {
    if (port === this.ports.in) {
      this.ports.out.send(this.callback(value, port, this));
    }
  }
}
