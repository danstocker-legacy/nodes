import {
  EventSource,
  IEventSource,
  ISink,
  Serviced,
  Sink,
  TNodeEventTypes
} from "../../node";
import {IInPort, InPort, TEventPorts, TInPorts} from "../../port";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink, IEventSource {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor() {
    Sink.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
