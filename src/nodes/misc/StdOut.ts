import {ISink, MSink} from "../../node";
import {IInPort, TInBundle} from "../../port";

interface IStdOutInputs {
  d_val: string | Buffer;
}

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink {
  public readonly i: TInBundle<IStdOutInputs>;

  constructor() {
    MSink.init.call(this, ["d_val"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.i.d_val) {
      process.stdout.write(input);
    }
  }
}
