import {InPort, Inputs, IPort, Node, Ports} from "../node";

/**
 * Pre-processes input so values with the same tag stay together.
 * Not recommended for use with dynamic graphs as cached values may be
 * purged on closing ports.
 */
export abstract class Syncer extends Node {
  private readonly buffer: Map<string, Inputs>;
  private readonly inPorts: Set<InPort<any>>;

  protected constructor() {
    super();
    this.buffer = new Map();
    this.inPorts = new Set();
  }

  public send(inputs: Inputs, tag: string): void {
    const buffer = this.buffer;
    const values = this.getValues(tag);

    // associating input values with port and tag
    for (const [port, value] of inputs.entries()) {
      values.set(port, value);
    }

    if (values.size >= this.inPorts.size) {
      // got all inputs for current tag
      buffer.delete(tag);
      this.process(values, tag);
    }
  }

  protected onPortOpen(name: string, port: IPort<any>, ports: Ports): void {
    if (ports === this.in) {
      for (const inputs of this.buffer.values()) {
        inputs.set(port as InPort<any>, undefined);
      }
      this.inPorts.add(port as InPort<any>);
    }
  }

  protected onPortClose(name: string, port: IPort<any>, ports: Ports): void {
    if (ports === this.in) {
      for (const inputs of this.buffer.values()) {
        inputs.delete(port as InPort<any>);
      }
      this.inPorts.delete(port as InPort<any>);
      this.processTags();
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

  private processTags(): void {
    for (const [tag, inputs] of this.buffer.entries()) {
      if (inputs.size >= this.inPorts.size) {
        this.process(inputs, tag);
      }
    }
  }
}
