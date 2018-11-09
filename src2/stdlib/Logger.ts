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
    this.addPort(new InPort("log", this));
    this.addPort(new InPort("warn", this));
    this.addPort(new InPort("err", this));
    this.addPort(new OutPort("log", this));
    this.addPort(new OutPort("warn", this));
    this.addPort(new OutPort("err", this));
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
