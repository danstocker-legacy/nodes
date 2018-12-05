import {ISource, MSource} from "../../node";
import {OutPort, TOutBundle} from "../../port";

interface ITickerOutputs {
  $: true;
}

/**
 * Emits a tick at the specified intervals.
 * @example
 * const ticker = new Ticker(5000);
 * ticker.o.$.connect(new StdOut().i.$);
 */
export class Ticker implements ISource {
  public readonly o: TOutBundle<ITickerOutputs>;

  constructor(ms: number) {
    MSource.init.call(this);
    setInterval(this.onInterval.bind(this), ms);
    this.o.$ = new OutPort("$", this);
  }

  private onInterval(): void {
    this.o.$.send(true, null);
  }
}
