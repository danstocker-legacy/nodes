import {InPort, Inputs, IPort, Node} from "../node";

export abstract class SyncerBase extends Node {
  private readonly buffer: Map<string, Inputs>;
  private count: number;

  protected constructor() {
    super();
    this.buffer = new Map();
    this.count = 0;
  }

  public send(inputs: Inputs, tag: string): void {
    const buffer = this.buffer;
    const count = this.count;
    for (const [port, value] of inputs.entries()) {
      // associating value with port and tag
      let values = buffer.get(tag);
      if (!values) {
        buffer.set(tag, values = new Map());
      }
      values.set(port, value);

      if (values.size === count) {
        // got all inputs for current tag
        buffer.delete(tag);
        this.process(values, tag);
      }
    }
  }

  protected onPortOpen<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort) {
      this.count++;
    }
  }

  protected onPortClose<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort) {
      this.count--;
    }
  }
}
