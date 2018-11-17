import {
  EventSource,
  IEventSource,
  ISource,
  Serviced,
  Source,
  TNodeEventTypes
} from "../../node";
import {OutPort, TEventPorts, TOutPorts} from "../../port";

/**
 * Takes input from `process.stdin` and sends it to output.
 */
export class StdIn implements ISource, IEventSource {
  public readonly out: TOutPorts<{
    $: string | Buffer;
  }>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor() {
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
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
