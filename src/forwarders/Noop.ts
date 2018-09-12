import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards input to output.
 */
export class Noop<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };

  constructor() {
    super();
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(inputs.get(this.in.$), tag);
  }
}
