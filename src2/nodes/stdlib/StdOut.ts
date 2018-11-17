import {
  ErrorSource,
  EventSource,
  IErrorSource,
  IEventSource,
  ISink,
  Serviced,
  Sink
} from "../../node";
import {IInPort, InPort, TErrorPorts, TEventPorts, TInPorts} from "../../port";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  constructor() {
    Sink.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
