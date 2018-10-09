import {InPort, Inputs, NodeBase, OutPort} from "../node";
import {EqualsCallback} from "./EqualsCallback";
import {reference} from "./equalsCallbacks";

/**
 * Sends input to output when it's different from the last input.
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

  constructor(equals: EqualsCallback<T> = reference) {
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
