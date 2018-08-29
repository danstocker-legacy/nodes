import {Node} from '../node/Node';

/**
 * Delays output by the specified number of milliseconds.
 */
export class Delayer<I> extends Node<I, I> {
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay) {
    super();
    this.delay = delay;
  }

  public in(value: any): void {
    this.timer = setTimeout(() => this.out(value), this.delay);
  }
}
