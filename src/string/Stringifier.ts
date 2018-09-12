import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Sends string representation of input to output.
 */
export class Stringifier<I> extends Node {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<string>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(String(inputs.get(this.in.$)), tag);
  }
}
