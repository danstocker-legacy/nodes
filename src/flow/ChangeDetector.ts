import {eq} from "../callbacks";
import {EqualsCallback} from "../callbacks/EqualsCallback";
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
  private readonly equals?: EqualsCallback<T>;
  private lastValue: T;

  constructor(equals: EqualsCallback<T> = eq.reference) {
    super();
    this.equals = equals;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const valueBefore = this.lastValue;
    const valueAfter = inputs.get(this.in.$);
    const factor = 1 - +this.equals(valueAfter, valueBefore);
    this.lastValue = valueAfter;
    this.out.$.send(factor, tag);
  }
}
