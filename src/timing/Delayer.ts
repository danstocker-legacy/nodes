import {Node} from '../Node';

/**
 * Delays output by the specified number of milliseconds.
 */
export class Delayer extends Node<any, any> {
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
