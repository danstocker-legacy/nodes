import {INode, InPort, Inputs, Node, OutPort} from "../node";

type MapperCallback<I, O> = (next: I, port: InPort<I>, node: INode) => O;

/**
 * Sends mapped input to output.
 */
export class Mapper<I, O> extends Node {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<O>
  };
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    super();
    this.callback = callback;
    this.openPort("in", new InPort(this));
    this.openPort("out", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const ports = this.ports;
    ports.out.send(this.callback(inputs.get(ports.in), ports.in, this), tag);
  }
}
