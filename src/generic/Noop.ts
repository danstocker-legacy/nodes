import {INode, InPort, OutPort} from "../node";

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

  public send(value: any, port: InPort<T>): void {
    if (port === this.ports.in) {
      this.ports.out.send(value);
    }
  }
}
