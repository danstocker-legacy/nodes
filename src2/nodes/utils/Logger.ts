import {
  EventEmitter,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source,
  TNodeEventTypes
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

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
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor() {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventEmitter.init.call(this);
    this.in.err = new InPort("err", this);
    this.in.log = new InPort("log", this);
    this.in.warn = new InPort("warn", this);
    this.out.err = new OutPort("err", this);
    this.out.log = new OutPort("log", this);
    this.out.warn = new OutPort("warn", this);
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
