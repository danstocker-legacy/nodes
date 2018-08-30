import {INode, Port} from "../node";

/**
 * Throttles output by the specified number of milliseconds.
 */
export class Throttler<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay) {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<Array<T>>(this)
    };
    this.delay = delay;
    this.values = [];
    this.onTimeout = this.onTimeout.bind(this);
  }

  public in(port: Port<T>, value: any): void {
    this.values.push(value);

    const timer = this.timer;
    if (!timer) {
      this.timer = setTimeout(this.onTimeout, this.delay);
    }
  }

  private onTimeout(): void {
    const values = this.values;
    if (values.length) {
      this.timer = setTimeout(this.onTimeout, this.delay);
      this.values = [];
      this.ports.out.out(values);
    } else {
      this.timer = undefined;
    }
  }
}
