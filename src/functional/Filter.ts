import {InPort, Inputs, NodeBase, OutPort} from "../node";
import {FilterCallback} from "./callbacks/FilterCallback";

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
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    if (this.callback(value, this.in.$, this)) {
      this.out.$.send(value, tag);
    }
  }
}
