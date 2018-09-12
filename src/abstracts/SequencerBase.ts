import {InPort, Inputs, IPort, Node} from "../node";

type Sequences = Map<InPort<any>, Array<string>>;

export abstract class SequencerBase extends Node {
  public readonly ports: {
    ref: InPort<string>,
    [key: string]: IPort<any>
  };
  private readonly buffer: Map<InPort<any>, Map<string, any>>;
  private readonly sequences: Sequences;

  protected constructor() {
    super();
    this.buffer = new Map();
    this.sequences = new Map();
  }

  public send(inputs: Inputs, tag: string): void {
    for (const [port, value] of inputs.entries()) {
      if (port === this.ports.ref) {
        // value was sent to reference port
        this.addTag(tag);
      }
      this.setInputValue(port, tag, value);
    }

    for (const port of this.sequences.keys()) {
      const nextTag = this.getNextTag(port);
      if (this.hasInputValue(port, nextTag)) {
        // value on current port for next tag found
        this.deleteNextTag(port);
        const value = this.getInputValue(port, nextTag);
        this.process(new Map([[port, value]]), tag);
      }
    }
  }

  protected onPortOpen<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort && port !== this.ports.ref) {
      this.sequences.set(port as InPort<T>, []);
    }
  }

  protected onPortClose<T>(name: string, port: IPort<T>): void {
    if (port instanceof InPort) {
      this.sequences.delete(port as InPort<T>);
    }
  }

  private setInputValue<T>(port: InPort<T>, tag: string, value: T): void {
    const buffer = this.buffer;
    let values = buffer.get(port);
    if (!values) {
      buffer.set(port, values = new Map());
    }
    values.set(tag, value);
  }

  private hasInputValue<T>(port: InPort<T>, tag: string): boolean {
    const values = this.buffer.get(port);
    return values && values.has(tag);
  }

  private getInputValue<T>(port: InPort<T>, tag: string): T {
    const values = this.buffer.get(port);
    return values && values.get(tag);
  }

  private addTag(tag: string): void {
    for (const tags of this.sequences.values()) {
      tags.push(tag);
    }
  }

  private getNextTag<T>(port: InPort<T>): string {
    const tags = this.sequences.get(port);
    return tags && tags[0];
  }

  private deleteNextTag<T>(port: InPort<T>): void {
    const tags = this.sequences.get(port);
    if (tags) {
      tags.shift();
    }
  }
}
