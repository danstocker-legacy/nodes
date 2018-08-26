import {Node} from '../Node';

/**
 * Outputs null on
 */
export class Interval extends Node<null, null> {
  private readonly delay: number;
  private readonly timer: number; // TODO: How coe not NodeJS.Timer?

  constructor(delay) {
    super();
    this.delay = delay;
    this.timer = setInterval(this.onInterval.bind(this), delay);
  }

  public in(value: null) {
    throw Error("Interval is source-only.");
  }

  private onInterval(): void {
    this.out(null);
  }
}