import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface ILoggerInputs {
  log: any;
  warn: any;
  err: any;
}

interface ILoggerOutputs {
  log: any;
  warn: any;
  err: any;
}

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 */
export class Logger implements ISink, ISource {
  public readonly i: TInBundle<ILoggerInputs>;
  public readonly o: TOutBundle<ILoggerOutputs>;

  constructor() {
    MSink.init.call(this, ["err", "log", "warn"]);
    MSource.init.call(this, ["err", "log", "warn"]);
  }

  public send(port: IInPort<any>, input: any, tag?: string): void {
    const inPorts = this.i;
    const outPorts = this.o;
    switch (port) {
      case inPorts.log:
        outPorts.log.send(input, tag);
        break;
      case inPorts.warn:
        outPorts.warn.send(input, tag);
        break;
      case inPorts.err:
        outPorts.err.send(input, tag);
        break;
    }
  }
}
