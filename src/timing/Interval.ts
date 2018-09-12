import {Node, OutPort} from "../node";

/**
 * Outputs `null` at intervals.
 */
export class Interval extends Node {
  public readonly out: {
    $: OutPort<null>
  };
  public readonly timer: number; // TODO: How coe not NodeJS.Timer?
  private readonly delay: number;

  constructor(delay: number) {
    super();
    this.timer = setInterval(this.onInterval.bind(this), delay);
    this.delay = delay;
    this.openPort("$", new OutPort());
  }

  protected process() {
    throw Error("Interval is source-only.");
  }

  private onInterval(): void {
    this.out.$.send(null, String(+new Date()));
  }
}
