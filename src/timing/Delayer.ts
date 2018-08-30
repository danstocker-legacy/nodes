import {INode, Port} from "../node";

/**
 * Delays output by the specified number of milliseconds.
 */
export class Delayer<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<T>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay) {
    this.delay = delay;
    this.ports = {
      in: new Port<T>(this),
      out: new Port<T>(this)
    };
  }

  public in(port: Port<T>, value: T): void {
    this.timer = setTimeout(() => this.ports.out.out(value), this.delay);
  }
}
