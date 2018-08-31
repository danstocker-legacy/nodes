import {INode, Port} from "../node";

export class StdIn implements INode {
  public readonly ports: {
    out: Port<string | Buffer>
  };

  constructor() {
    this.ports = {
      out: new Port<string | Buffer>(this)
    };
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  public in(port: Port<null>, value: null) {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.ports.out.out(chunk);
    }
  }
}
