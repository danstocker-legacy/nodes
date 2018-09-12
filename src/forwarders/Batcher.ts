import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Sends input to output in batches of a given size.
 */
export class Batcher<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<Array<T>>
  };
  public readonly length: number;
  private readonly buffer: Array<T>;

  constructor(length: number) {
    super();
    this.length = length;
    this.buffer = [];
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const buffer = this.buffer;
    buffer.push(inputs.get(this.in.$));
    if (buffer.length === this.length) {
      this.out.$.send(buffer, tag);
    }
  }
}
