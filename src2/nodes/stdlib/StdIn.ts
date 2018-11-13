import {ISource} from "../../node";
import {OutPort, TOutPorts} from "../../port";

interface IStdInOutputs {
  $: string | Buffer;
}

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn implements ISource {
  public readonly out: TOutPorts<IStdInOutputs>;

  constructor() {
    this.out = {
      $: new OutPort("$", this)
    };
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk);
    }
  }
}
