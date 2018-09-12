import {InPort, Inputs, IPort, Node} from "../node";

/**
 * Pre-processes inputs, releasing only complete input sets to #process().
 */
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
    const values = this.getValues(tag);

    // associating input values with port and tag
    for (const [port, value] of inputs.entries()) {
      values.set(port, value);
    }

    if (values.size === count) {
      // got all inputs for current tag
      buffer.delete(tag);
      this.process(values, tag);
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

  private getValues(tag: string): Inputs {
    const buffer = this.buffer;
    let values = buffer.get(tag);
    if (!values) {
      buffer.set(tag, values = new Map());
    }
    return values;
  }
}
