import {INode, InPort, OutPort} from "../node";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn implements INode {
  public readonly ports: {
    out: OutPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      out: new OutPort()
    };
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  public send() {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.ports.out.send(chunk, String(+new Date()));
    }
  }
}
