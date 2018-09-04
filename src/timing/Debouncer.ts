import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Forwards batches of input values with debouncing.
 */
export class Debouncer<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<T>;

  constructor(delay: number) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.delay = delay;
    this.values = [];
  }

  public send(inputs: Inputs, ts?: number): void {
    this.values.push(inputs.get(this.ports.in));

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    const onTimeout = () => {
      const values = this.values;
      this.timer = undefined;
      this.values = [];
      this.ports.out.send(values, ts);
    };

    this.timer = setTimeout(onTimeout, this.delay);
  }
}
