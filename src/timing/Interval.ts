import {INode, Port} from "../node";

/**
 * Outputs null at intervals.
 */
export class Interval implements INode {
  public readonly ports: {
    out: Port<null>
  };
  public readonly timer: number; // TODO: How coe not NodeJS.Timer?
  private readonly delay: number;

  constructor(delay) {
    this.ports = {
      out: new Port<null>(this)
    };
    this.timer = setInterval(this.onInterval.bind(this), delay);
    this.delay = delay;
  }

  public in(port: Port<null>, value: null) {
    throw Error("Interval is source-only.");
  }

  private onInterval(): void {
    this.ports.out.out(null);
  }
}
