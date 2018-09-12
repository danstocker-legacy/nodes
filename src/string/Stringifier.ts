import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Sends string representation of input to output.
 */
export class Stringifier<I> extends Node {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<string>
  };

  constructor() {
    super();
    this.openPort("in", new InPort(this));
    this.openPort("out", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.ports.out.send(String(inputs.get(this.ports.in)), tag);
  }
}
