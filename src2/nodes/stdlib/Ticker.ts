import {EventSource, IEventSource, ISource, Serviced, Source} from "../../node";
import {OutPort, TEventPorts, TOutPorts} from "../../port";

/**
 * Emits a tick at the specified intervals.
 * @example
 * const ticker = new Ticker(5000);
 * ticker.out.tick.connect(new StdOut().in.$);
 */
export class Ticker implements ISource, IEventSource {
  public readonly out: TOutPorts<{
    tick: true
  }>;
  public readonly svc: TEventPorts<Source.TEventTypes>;

  constructor(ms: number) {
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    setInterval(this.onInterval.bind(this), ms);
    this.out.tick = new OutPort("tick", this);
  }

  private onInterval(): void {
    this.out.tick.send(true, null);
  }
}
