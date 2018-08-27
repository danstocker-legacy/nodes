import {Node} from '../Node';
import {FilterCallback} from "../typedefs";

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<I> extends Node<I, I> {
  /**
   * Filter callback. Similar to callback passed to Array#filter().
   */
  private readonly callback: FilterCallback<I>;

  constructor(callback: FilterCallback<I>) {
    super();
    this.callback = callback;
  }

  public in(value: I): void {
    const source = this.in['source'];
    if (this.callback(value, source && source.id, this.sources)) {
      this.out(value);
    }
  }
}
