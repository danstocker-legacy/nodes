import {FilterCallback} from "../callbacks/FilterCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly callback: FilterCallback<T>;

  constructor(callback: FilterCallback<T>) {
    super();
    this.callback = callback;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    if (this.callback(value, this.in.$, this)) {
      this.out.$.send(value, tag);
    }
  }
}
