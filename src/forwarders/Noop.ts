import {InPort, Inputs, Node, OutPort} from "../node/index";

/**
 * Forwards input to output.
 */
export class Noop<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };

  constructor() {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.ports.out.send(inputs.get(this.ports.in), tag);
  }
}
