import {INode, InPort, Inputs, OutPort} from "../node";

type TaggerCallback<T> = (value: T, tag?: string) => string;

/**
 * Forwards input to output with the tag changed.
 */
export class Tagger<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly callback: TaggerCallback<T>;

  constructor(callback: TaggerCallback<T>) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.callback = callback;
  }

  public send(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.ports.in);
    tag = this.callback(value, tag);
    this.ports.out.send(value, tag);
  }
}
