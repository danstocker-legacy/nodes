import {Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 */
export class Logger extends Node {
  public readonly in: TInPorts<{
    log: any,
    warn: any,
    err: any
  }>;
  public readonly out: TOutPorts<{
    log: any,
    warn: any,
    err: any
  }>;

  constructor() {
    super();
    this.in.log = new InPort("log", this);
    this.in.warn = new InPort("warn", this);
    this.in.err = new InPort("err", this);
    this.out.log = new OutPort("log", this);
    this.out.warn = new OutPort("warn", this);
    this.out.err = new OutPort("err", this);
  }

  public send<T>(port: IInPort<T>, input: T, tag?: string): void {
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
