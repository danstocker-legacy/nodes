import {INode, InPort, Inputs, OutPort} from "../node";

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
      out: new OutPort()
    };
    this.callback = callback;
  }

  public send(inputs: Inputs, tag?: string): void {
    const ports = this.ports;
    ports.out.send(this.callback(inputs.get(ports.in), ports.in, this), tag);
  }
}
