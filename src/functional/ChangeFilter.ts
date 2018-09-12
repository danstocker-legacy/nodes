import {InPort, Inputs, Node, OutPort} from "../node";

type EqualsCallback<T> = (a: T, b: T) => boolean;

/**
 * Sends input to output when it's different from the last input.
 */
export class ChangeFilter<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly equals?: EqualsCallback<T>;
  private lastValue: T;

  constructor(equals?: EqualsCallback<T>) {
    super();
    this.equals = equals;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const equals = this.equals;
    const valueBefore = this.lastValue;
    const valueAfter = inputs.get(this.in.$);
    if (
      equals && !equals(valueAfter, valueBefore) ||
      !equals && valueAfter !== valueBefore
    ) {
      this.lastValue = valueAfter;
      this.out.$.send(valueAfter, tag);
    }
  }
}
