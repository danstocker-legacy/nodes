import {FilterCallback} from "../typedefs";
import {INode, Port} from "../node";

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<T>
  };

  /**
   * Filter callback. Similar to callback passed to Array#filter().
   */
  private readonly callback: FilterCallback<T>;

  constructor(callback: FilterCallback<T>) {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<T>(this)
    };
    this.callback = callback;
  }

  public in(port: Port<T>, value: T): void {
    const source = this.in['source'];
    if (this.callback(value, source && source.id, this)) {
      this.ports.out.out(value);
    }
  }
}
