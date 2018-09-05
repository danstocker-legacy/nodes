import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Forwards input to output.
 */
export class Noop<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };

  constructor() {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
  }

  public send(inputs: Inputs, tag?: string): void {
    this.ports.out.send(inputs.get(this.ports.in), tag);
  }
}
