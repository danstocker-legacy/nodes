import {equal} from "../callbacks";
import {EqualCallback} from "../callbacks/EqualCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends input to output when it's different from the last input.
 * @deprecated Use `new Filter(filter.change$())` instead.
 */
export class ChangeFilter<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly equals?: EqualCallback<T>;
  private lastValue: T;

  constructor(equals: EqualCallback<T> = equal.reference) {
    super();
    this.equals = equals;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const valueBefore = this.lastValue;
    const valueAfter = inputs.get(this.in.$);
    if (!this.equals(valueAfter, valueBefore)) {
      this.lastValue = valueAfter;
      this.out.$.send(valueAfter, tag);
    }
  }
}
