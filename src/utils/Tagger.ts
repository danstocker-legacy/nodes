import {InPort, Inputs, NodeBase, OutPort} from "../node";

type TaggerCallback<T> = (value: T, tag?: string) => string;

/**
 * Forwards input to output with the tag changed.
 */
export class Tagger<T> extends NodeBase {
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
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    tag = this.callback(value, tag);
    this.out.$.send(value, tag);
  }
}
