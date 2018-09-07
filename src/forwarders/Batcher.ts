import {InPort, Inputs, Node, OutPort} from "../node/index";

/**
 * Sends input to output in batches of a given size.
 */
export class Batcher<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  public readonly length: number;
  private readonly buffer: Array<T>;

  constructor(length: number) {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.length = length;
    this.buffer = [];
  }

  protected process(inputs: Inputs, tag?: string): void {
    const buffer = this.buffer;
    buffer.push(inputs.get(this.ports.in));
    if (buffer.length === this.length) {
      this.ports.out.send(buffer, tag);
    }
  }
}
