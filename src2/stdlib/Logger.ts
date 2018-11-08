import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
 */
export class Logger extends Node {
  public readonly in: TStaticInPorts<{
    log: any,
    warn: any,
    err: any
  }>;
  public readonly out: TStaticOutPorts<{
    log: any,
    warn: any,
    err: any
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("log", this));
    this.addPort(new StaticInPort("warn", this));
    this.addPort(new StaticInPort("err", this));
    this.addPort(new StaticOutPort("log", this));
    this.addPort(new StaticOutPort("warn", this));
    this.addPort(new StaticOutPort("err", this));
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
