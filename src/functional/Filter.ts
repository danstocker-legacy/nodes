import {INode, InPort, Inputs, Node, OutPort} from "../node";

type FilterCallback<T> = (next: T, port: InPort<T>, node: INode) => boolean;

/**
 * Outputs only those inputs that satisfy the specified filter callback.
 */
export class Filter<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly callback: FilterCallback<T>;

  constructor(callback: FilterCallback<T>) {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.callback = callback;
  }

  protected process(inputs: Inputs, tag?: string): void {
    const ports = this.ports;
    const value = inputs.get(ports.in);
    if (this.callback(value, ports.in, this)) {
      this.ports.out.send(value, tag);
    }
  }
}
