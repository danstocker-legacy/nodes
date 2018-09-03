import {INode, InPort, OutPort} from "../node";

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

  public send(value: I, port: InPort<I>): void {
    if (port === this.ports.in) {
      this.ports.out.send(String(value));
    }
  }
}
