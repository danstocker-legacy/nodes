import {INode, Port} from "../node";

type FilterCallback<T> = (next: T, source: Port<T>, port: Port<T>) => boolean;

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
      const source = port.in["source"];
      if (this.callback(value, source, port)) {
        this.ports.out.out(value);
      }
    }
  }
}
