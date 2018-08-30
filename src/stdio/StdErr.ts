import {INode, Port} from "../node";

export class StdErr implements INode {
  public readonly ports: {
    in: Port<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new Port<string | Buffer>(this)
    };
  }

  public in(port: Port<string | Buffer>, value: string | Buffer): void {
    if (port === this.ports.in) {
      process.stderr.write(value);
    }
  }
}
