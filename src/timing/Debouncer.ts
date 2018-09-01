import {INode, InPort, OutPort} from "../node";

/**
 * Forwards batches of input values debounced.
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
    this.onTimeout = this.onTimeout.bind(this);
  }

  public send(port: InPort<T>, value: T): void {
    if (port === this.ports.in) {
      this.values.push(value);

      const timer = this.timer;
      if (timer) {
        clearTimeout(timer);
      }

      this.timer = setTimeout(this.onTimeout, this.delay);
    }
  }

  private onTimeout(): void {
    const values = this.values;
    this.timer = undefined;
    this.values = [];
    this.ports.out.send(values);
  }
}
