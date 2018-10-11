import {InPort, Inputs, NodeBase, OutPort} from "../node";
import {MapCallback} from "./callbacks/MapCallback";

/**
 * Sends mapped input to output.
 */
export class Mapper<I, O> extends NodeBase {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<O>
  };
  private readonly callback: MapCallback<I, O>;

  constructor(callback: MapCallback<I, O>) {
    super();
    this.callback = callback;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(this.callback(inputs.get(this.in.$), this.in.$, this), tag);
  }
}
