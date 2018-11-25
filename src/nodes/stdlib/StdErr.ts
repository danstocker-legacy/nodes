import {ISink, MSink} from "../../node";
import {IInPort, TInBundle} from "../../port";

interface IStdErrInputs {
  $: string | Buffer;
}

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr implements ISink {
  public readonly in: TInBundle<IStdErrInputs>;

  constructor() {
    MSink.init.call(this, ["$"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
