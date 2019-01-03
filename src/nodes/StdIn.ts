import {ISource, MSource} from "../node";
import {OutPort, TOutBundle} from "../port";

interface IStdInOutputs {
  d_val: string | Buffer;
}

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn implements ISource {
  public readonly o: TOutBundle<IStdInOutputs>;

  constructor() {
    MSource.init.call(this, ["d_val"]);
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.o.d_val.send(chunk);
    }
  }
}
