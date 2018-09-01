import {INode, InPort} from "../node";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements INode {
  public readonly ports: {
    in: InPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new InPort(this)
    };
  }

  public send(port: InPort<string | Buffer>, value: string | Buffer): void {
    if (port === this.ports.in) {
      process.stdout.write(value);
    }
  }
}
