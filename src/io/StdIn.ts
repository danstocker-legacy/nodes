import {Node, OutPort} from "../node";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn extends Node {
  public readonly out: {
    $: OutPort<string | Buffer>
  };

  constructor() {
    super();
    this.openOutPort("$", new OutPort());
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  protected process() {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk, String(+new Date()));
    }
  }
}
