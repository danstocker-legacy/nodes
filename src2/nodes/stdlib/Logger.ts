import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

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
  public readonly in: TInPorts<ILoggerInputs>;
  public readonly out: TOutPorts<ILoggerOutputs>;

  constructor() {
    this.in = {
      err: new InPort("err", this),
      log: new InPort("log", this),
      warn: new InPort("warn", this)
    };
    this.out = {
      err: new OutPort("err", this),
      log: new OutPort("log", this),
      warn: new OutPort("warn", this)
    };
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
