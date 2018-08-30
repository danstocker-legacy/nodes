import {INode, Port} from "../node";

/**
 * Debounces output by the specified number of milliseconds.
 */
export class Debouncer<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<T>;

  constructor(delay) {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<Array<T>>(this)
    };
    this.delay = delay;
    this.values = [];
    this.onTimeout = this.onTimeout.bind(this);
  }

  public in(port:Port<T>, value: T): void {
    this.values.push(value);

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    this.timer = setTimeout(this.onTimeout, this.delay);
  }

  private onTimeout(): void {
    const values = this.values;
    this.timer = undefined;
    this.values = [];
    this.ports.out.out(values);
  }
}
