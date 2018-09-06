import {InPort, Inputs, Node, OutPort} from "../node";

type TaggerCallback<T> = (value: T, tag?: string) => string;

/**
 * Forwards input to output with the tag changed.
 */
export class Tagger<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly callback: TaggerCallback<T>;

  constructor(callback: TaggerCallback<T>) {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.callback = callback;
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.ports.in);
    tag = this.callback(value, tag);
    this.ports.out.send(value, tag);
  }
}
