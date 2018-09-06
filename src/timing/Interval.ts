import {INode, OutPort} from "../node";

/**
 * Outputs `null` at intervals.
 */
export class Interval implements INode {
  public readonly ports: {
    out: OutPort<null>
  };
  public readonly timer: number; // TODO: How coe not NodeJS.Timer?
  private readonly delay: number;

  constructor(delay: number) {
    this.ports = {
      out: new OutPort()
    };
    this.timer = setInterval(this.onInterval.bind(this), delay);
    this.delay = delay;
  }

  public send() {
    throw Error("Interval is source-only.");
  }

  private onInterval(): void {
    this.ports.out.send(null, String(+new Date()));
  }
}
