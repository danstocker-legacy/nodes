import {NodeBase, OutPort} from "../node";

/**
 * Outputs Unix timestamp at intervals. Tags output with unix timestamp.
 */
export class Interval extends NodeBase {
  public readonly out: {
    $: OutPort<number>
  };
  public readonly timer: number; // TODO: How coe not NodeJS.Timer?
  private readonly delay: number;

  constructor(delay: number) {
    super();
    this.timer = setInterval(this.onInterval.bind(this), delay);
    this.delay = delay;
    this.openOutPort("$");
  }

  protected process() {
    throw Error("Interval is source-only.");
  }

  private onInterval(): void {
    const timestamp = +new Date();
    this.out.$.send(timestamp, `${timestamp}`);
  }
}
