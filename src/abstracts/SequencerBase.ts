import {InPort, Inputs, IPort, Node, OutPort} from "../node";

type Sequences = Map<InPort<any>, Array<string>>;

export abstract class SequencerBase extends Node {
  public readonly in: {
    ref: InPort<string>
  };
  public readonly out: {
    [key: string]: OutPort<any>
  };
  private readonly buffer: Map<InPort<any>, Map<string, any>>;
  private readonly sequences: Sequences;

  protected constructor() {
    super();
    this.buffer = new Map();
    this.sequences = new Map();
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

  protected onPortOpen<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort && port !== this.in.ref) {
      this.sequences.set(port as InPort<T>, []);
    }
  }

  protected onPortClose<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort) {
      this.sequences.delete(port as InPort<T>);
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
