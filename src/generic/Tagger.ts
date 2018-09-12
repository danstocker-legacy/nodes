import {InPort, Inputs, Node, OutPort} from "../node";

type TaggerCallback<T> = (value: T, tag?: string) => string;

/**
 * Forwards input to output with the tag changed.
 */
export class Tagger<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly callback: TaggerCallback<T>;

  constructor(callback: TaggerCallback<T>) {
    super();
    this.callback = callback;
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    tag = this.callback(value, tag);
    this.out.$.send(value, tag);
  }
}
