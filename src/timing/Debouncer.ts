import {Node} from '../node/Node';

/**
 * Debounces output by the specified number of milliseconds.
 */
export class Debouncer<I> extends Node<I, Array<I>> {
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay) {
    super();
    this.delay = delay;
    this.values = [];
    this.onTimeout = this.onTimeout.bind(this);
  }

  public in(value: any): void {
    this.values.push(value);

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    this.timer = setTimeout(this.onTimeout, this.delay);
  }

  private onTimeout(): void {
    const values = this.values;
    this.timer = undefined;
    this.values = [];
    this.out(values);
  }
}
