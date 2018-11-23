import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 */
export class Logger implements ISink, ISource {
  public readonly in: TInPorts<{
    log: any;
    warn: any;
    err: any;
  }>;
  public readonly out: TOutPorts<{
    log: any;
    warn: any;
    err: any;
  }>;

  constructor() {
    MSink.init.call(this, ["err", "log", "warn"]);
    MSource.init.call(this, ["err", "log", "warn"]);
  }

  public send(port: IInPort<any>, input: any, tag?: string): void {
    const inPorts = this.in;
    const outPorts = this.out;
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
