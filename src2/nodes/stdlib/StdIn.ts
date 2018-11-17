import {
  ErrorSource,
  EventSource,
  IEventSource,
  ISource,
  Serviced,
  Source
} from "../../node";
import {OutPort, TEventPorts, TOutPorts} from "../../port";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn implements ISource, IEventSource {
  public readonly out: TOutPorts<{
    $: string | Buffer;
  }>;
  public readonly svc: TEventPorts<Source.TEventTypes>;

  constructor() {
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.out.$ = new OutPort("$", this);
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  private onReadable() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      this.out.$.send(chunk);
    }
  }
}
