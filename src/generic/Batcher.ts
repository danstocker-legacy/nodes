import {INode, InPort, OutPort} from "../node";

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

  public send(port: InPort<T>, value: T): void {
    if (port === this.ports.in) {
      const buffer = this.buffer;
      buffer.push(value);
      if (buffer.length === this.length) {
        this.ports.out.send(buffer);
      }
    }
  }
}
