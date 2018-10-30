import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends string representation of input to output.
 * @deprecated Use `new Mapper(map.stringify)` instead
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
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(String(inputs.get(this.in.$)), tag);
  }
}
