import {INode, InPort, Inputs, OutPort} from "../node";

type EqualsCallback<T> = (a: T, b: T) => boolean;

/**
 * Sends input to output when it's different from the last input.
 */
export class ChangeFilter<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly equals?: EqualsCallback<T>;
  private lastValue: T;

  constructor(equals?: EqualsCallback<T>) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.equals = equals;
  }

  public send(inputs: Inputs, tag?: string): void {
    const equals = this.equals;
    const valueBefore = this.lastValue;
    const valueAfter = inputs.get(this.ports.in);
    if (
      equals && !equals(valueAfter, valueBefore) ||
      !equals && valueAfter !== valueBefore
    ) {
      this.lastValue = valueAfter;
      this.ports.out.send(valueAfter, tag);
    }
  }
}
