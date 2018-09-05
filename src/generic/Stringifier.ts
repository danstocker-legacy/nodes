import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Sends string representation of input to output.
 */
export class Stringifier<I> implements INode {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<string>
  };

  constructor() {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
  }

  public send(inputs: Inputs, tag?: number): void {
    this.ports.out.send(String(inputs.get(this.ports.in)), tag);
  }
}
