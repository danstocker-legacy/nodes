import {INode, InPort, OutPort} from "../node";

/**
 * Throttles output by the specified number of milliseconds.
 */
export class Throttler<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay: number) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.delay = delay;
    this.values = [];
    this.onTimeout = this.onTimeout.bind(this);
  }

  public in(port: InPort<T>, value: any): void {
    if (port === this.ports.in) {
      this.values.push(value);

      const timer = this.timer;
      if (!timer) {
        this.timer = setTimeout(this.onTimeout, this.delay);
      }
    }
  }

  private onTimeout(): void {
    const values = this.values;
    if (values.length) {
      this.timer = setTimeout(this.onTimeout, this.delay);
      this.values = [];
      this.ports.out.send(values);
    } else {
      this.timer = undefined;
    }
  }
}
