import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface ILoggerInputs {
  d_log: any;
  d_warn: any;
  d_err: any;
}

interface ILoggerOutputs {
  d_log: any;
  d_warn: any;
  d_err: any;
}

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 */
export class Logger implements ISink, ISource {
  public readonly i: TInBundle<ILoggerInputs>;
  public readonly o: TOutBundle<ILoggerOutputs>;

  constructor() {
    MSink.init.call(this, ["d_err", "d_log", "d_warn"]);
    MSource.init.call(this, ["d_err", "d_log", "d_warn"]);
  }

  public send(port: IInPort<any>, input: any, tag?: string): void {
    const inPorts = this.i;
    const outPorts = this.o;
    switch (port) {
      case inPorts.d_log:
        outPorts.d_log.send(input, tag);
        break;
      case inPorts.d_warn:
        outPorts.d_warn.send(input, tag);
        break;
      case inPorts.d_err:
        outPorts.d_err.send(input, tag);
        break;
    }
  }
}
