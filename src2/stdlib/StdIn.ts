import {Node} from "../node";
import {StaticOutPort, TStaticOutPorts} from "../port";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn extends Node {
  public readonly out: TStaticOutPorts<{
    $: string | Buffer
  }>;

  constructor() {
    super();
    this.addPort(new StaticOutPort("$", this));
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  public send() {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk);
    }
  }
}
