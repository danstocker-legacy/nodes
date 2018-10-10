import {ecb} from "../callbacks";
import {EqualsCallback} from "../callbacks/EqualsCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends input to output when it's different from the last input.
 * @deprecated Use `new Filter(change())` instead.
 */
export class ChangeFilter<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly equals?: EqualsCallback<T>;
  private lastValue: T;

  constructor(equals: EqualsCallback<T> = ecb.reference) {
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
