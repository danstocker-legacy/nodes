import {INode, InPort, OutPort} from "../node";

export class StdIn implements INode {
  public readonly ports: {
    out: OutPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      out: new OutPort(this)
    };
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  public in(port: InPort<null>, value: null) {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.ports.out.send(chunk);
    }
  }
}
