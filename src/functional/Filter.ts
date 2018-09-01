import {INode, InPort, OutPort} from "../node";

type FilterCallback<T> = (next: T, port: InPort<T>, node: INode) => boolean;

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly callback: FilterCallback<T>;

  constructor(callback: FilterCallback<T>) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.callback = callback;
  }

  public in(port: InPort<T>, value: T): void {
    if (port === this.ports.in) {
      if (this.callback(value, port, this)) {
        this.ports.out.send(value);
      }
    }
  }
}
