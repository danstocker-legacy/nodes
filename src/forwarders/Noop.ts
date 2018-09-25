import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Forwards input to output.
 */
export class Noop<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(inputs.get(this.in.$), tag);
  }
}
