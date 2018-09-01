import {INode, InPort, OutPort} from "../node";

/**
 * Delays output by the specified number of milliseconds.
 */
export class Delayer<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay: number) {
    this.delay = delay;
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
  }

  public send(port: InPort<T>, value: T): void {
    if (port === this.ports.in) {
      this.timer = setTimeout(() => this.ports.out.send(value), this.delay);
    }
  }
}
