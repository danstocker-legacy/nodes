import {
  EventSource,
  IEventSource,
  ISource,
  Serviced,
  Source,
  TNodeEventTypes
} from "../../node";
import {OutPort, TEventPorts, TOutPorts} from "../../port";

export class Interval implements ISource, IEventSource {
  public readonly out: TOutPorts<{
    $: true
  }>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor(ms: number) {
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    setInterval(this.onInterval.bind(this), ms);
    this.out.$ = new OutPort("$", this);
  }

  private onInterval(): void {
    this.out.$.send(true, null);
  }
}
