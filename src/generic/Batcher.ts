import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Sends input to output in batches of a given size.
 */
export class Batcher<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  public readonly length: number;
  private readonly buffer: Array<T>;

  constructor(length: number) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.length = length;
    this.buffer = [];
  }

  public send(inputs: Inputs, tag?: number): void {
    const buffer = this.buffer;
    buffer.push(inputs.get(this.ports.in));
    if (buffer.length === this.length) {
      this.ports.out.send(buffer, tag);
    }
  }
}
