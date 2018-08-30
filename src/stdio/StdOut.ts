import {INode, Port} from "../node";

export class StdOut implements INode {
  public readonly ports: {
    in: Port<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new Port<string | Buffer>(this)
    };
  }

  public in(port: Port<string | Buffer>, value: string | Buffer): void {
    process.stdout.write(value);
  }
}
