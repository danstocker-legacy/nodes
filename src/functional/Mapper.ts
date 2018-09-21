import {INode, InPort, Inputs, Node, OutPort} from "../node";

type MapperCallback<I, O> = (next: I, port: InPort<I>, node: INode) => O;

/**
 * Sends mapped input to output.
 */
export class Mapper<I, O> extends Node {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<O>
  };
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    super();
    this.callback = callback;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(this.callback(inputs.get(this.in.$), this.in.$, this), tag);
  }
}
