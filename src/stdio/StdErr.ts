import {INode, InPort} from "../node";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr implements INode {
  public readonly ports: {
    in: InPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new InPort(this)
    };
  }

  public send(value: string | Buffer, port: InPort<string | Buffer>): void {
    if (port === this.ports.in) {
      process.stderr.write(value);
    }
  }
}
