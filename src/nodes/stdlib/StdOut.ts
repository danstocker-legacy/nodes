import {ISink, MSink} from "../../node";
import {IInPort, TInBundle} from "../../port";

interface IStdOutInputs {
  $: string | Buffer;
}

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink {
  public readonly in: TInBundle<IStdOutInputs>;

  constructor() {
    MSink.init.call(this, ["$"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
