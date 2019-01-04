import {IAtomicSink, MSink} from "../node";
import {IInPort, TInBundle} from "../port";

export interface IInputs {
  d_val: string | Buffer;
}

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements IAtomicSink {
  public readonly i: TInBundle<IInputs>;

  constructor() {
    MSink.init.call(this, ["d_val"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.i.d_val) {
      process.stdout.write(input);
    }
  }
}
