import {NodeBase, OutPort} from "../node";

/**
 * Takes input from `process.stdin` and sends it to output.
 * Tags output with Unix timestamp.
 */
export class StdIn extends NodeBase {
  public readonly out: {
    $: OutPort<string | Buffer>
  };

  constructor() {
    super();
    this.openOutPort("$");
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  protected process() {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk, `${+new Date()}`);
    }
  }
}
