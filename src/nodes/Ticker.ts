import {ISource, MSource} from "../node";
import {TOutBundle} from "../port";

interface ITickerOutputs {
  ev_tick: true;
}

/**
 * Emits a tick at the specified intervals.
 * @example
 * const ticker = new Ticker(5000);
 * ticker.o.ev_tick.connect(new StdOut().i.d_val);
 * // stdout written on each tick
 */
export class Ticker implements ISource {
  public readonly o: TOutBundle<ITickerOutputs>;

  constructor(ms: number) {
    MSource.init.call(this, ["ev_tick"]);
    setInterval(this.onInterval.bind(this), ms);
  }

  private onInterval(): void {
    this.o.ev_tick.send(true);
  }
}
