import {ISource, Node, Source} from "../../node";
import {OutPort, TOutPorts} from "../../port";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn extends Node implements ISource {
  public readonly out: TOutPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    super();
    Source.init.call(this);
    this.out.$ = new OutPort("$", this);
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk);
    }
  }
}
