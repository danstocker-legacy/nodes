import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

interface IInputs {
  d_log: any;
  d_warn: any;
  d_err: any;
}

interface IOutputs {
  d_log: any;
  d_warn: any;
  d_err: any;
}

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 * TODO: Necessary?
 */
export class Logger implements ISink, ISource {
  public readonly i: TInBundle<IInputs>;
  public readonly o: TOutBundle<IOutputs>;

  constructor() {
    MSink.init.call(this, ["d_err", "d_log", "d_warn"]);
    MSource.init.call(this, ["d_err", "d_log", "d_warn"]);
  }

  public send(port: IInPort<any>, input: any, tag?: string): void {
    const i = this.i;
    const o = this.o;
    switch (port) {
      case i.d_log:
        o.d_log.send(input, tag);
        break;
      case i.d_warn:
        o.d_warn.send(input, tag);
        break;
      case i.d_err:
        o.d_err.send(input, tag);
        break;
    }
  }
}
