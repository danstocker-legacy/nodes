import {INode, Port} from "../node";

type FilterCallback<T> = (next: T, i: string, node: INode) => boolean;

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<T> implements INode {
  public readonly ports: {
    in: Port<T>,
    out: Port<T>
  };
  private readonly callback: FilterCallback<T>;

  constructor(callback: FilterCallback<T>) {
    this.ports = {
      in: new Port<T>(this),
      out: new Port<T>(this)
    };
    this.callback = callback;
  }

  public in(port: Port<T>, value: T): void {
    if (port === this.ports.in) {
      const source = this.in["source"];
      if (this.callback(value, source && source.id, this)) {
        this.ports.out.out(value);
      }
    }
  }
}
