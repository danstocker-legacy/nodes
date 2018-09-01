import {INode, InPort, OutPort} from "../node/index";

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

  public send(port: InPort<T>, value: T): void {
    if (port === this.ports.in) {
      const equals = this.equals;
      const lastValue = this.lastValue;
      if (
        equals && !equals(value, lastValue) ||
        !equals && value !== lastValue
      ) {
        this.lastValue = value;
        this.ports.out.send(value);
      }
    }
  }
}
