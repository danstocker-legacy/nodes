import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends string representation of input to output.
 * @deprecated Use `new Mapper(stringify)` instead
 */
export class Stringifier<I> extends NodeBase {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<string>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(String(inputs.get(this.in.$)), tag);
  }
}
