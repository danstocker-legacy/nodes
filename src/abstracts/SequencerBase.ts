import {InPort, Inputs, IPort, Node, Ports} from "../node";

type Sequences = Map<InPort<any>, Array<string>>;

/**
 * Pre-processes input so it's following a reference order.
 * Not recommended for use with dynamic graphs as cached values may be
 * purged on closing ports.
 */
export abstract class SequencerBase extends Node {
  public readonly in: {
    ref: InPort<string>
  };
  private readonly buffer: Map<InPort<any>, Map<string, any>>;
  private readonly sequences: Sequences;

  protected constructor() {
    super();
    this.buffer = new Map();
    this.sequences = new Map();
    this.openInPort("ref", new InPort(this));
  }

  public send(inputs: Inputs, tag: string): void {
    const sequences = this.sequences;
    for (const [port, value] of inputs.entries()) {
      if (port === this.in.ref) {
        // value was sent to reference port
        // adding tag to all ports
        for (const tags of sequences.values()) {
          tags.push(tag);
        }
      } else {
        // associating value with port and tag
        const values = this.getValues(port);
        const sequence = sequences.get(port);
        values.set(tag, value);

        // releasing next available values on current port
        while (values.has(sequence[0])) {
          const nextTag = sequence.shift();
          const nextValue = values.get(nextTag);
          values.delete(nextTag);
          this.process(new Map([[port, nextValue]]), nextTag);
        }
      }
    }
  }

  protected onPortOpen(name: string, port: IPort<any>, ports: Ports): void {
    if (ports === this.in && port !== this.in.ref) {
      this.buffer.set(port as InPort<any>, new Map());
      this.sequences.set(port as InPort<any>, []);
    }
  }

  protected onPortClose(name: string, port: IPort<any>, ports: Ports): void {
    if (ports === this.in) {
      this.buffer.delete(port as InPort<any>);
      this.sequences.delete(port as InPort<any>);
    }
  }

  private getValues<T>(port: InPort<T>): Map<string, T> {
    const buffer = this.buffer;
    let values = buffer.get(port);
    if (!values) {
      buffer.set(port, values = new Map());
    }
    return values;
  }
}
