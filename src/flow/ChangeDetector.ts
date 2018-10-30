import {equal} from "../callbacks";
import {EqualCallback} from "../callbacks/EqualCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends 1 to output when current input is different from previous, 0 otherwise.
 */
export class ChangeDetector<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<number>
  };
  private readonly equals?: EqualCallback<T>;
  private lastValue: T;

  constructor(equals: EqualCallback<T> = equal.reference) {
    super();
    this.equals = equals;
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    const valueBefore = this.lastValue;
    const valueAfter = inputs.get(this.in.$);
    const factor = 1 - +this.equals(valueAfter, valueBefore);
    this.lastValue = valueAfter;
    this.out.$.send(factor, tag);
  }
}
