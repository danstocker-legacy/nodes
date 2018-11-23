import {ISource, MSource} from "../../node";
import {OutPort, TOutPorts} from "../../port";

/**
 * Emits a tick at the specified intervals.
 * @example
 * const ticker = new Ticker(5000);
 * ticker.out.$.connect(new StdOut().in.$);
 */
export class Ticker implements ISource {
  public readonly out: TOutPorts<{
    $: true
  }>;

  constructor(ms: number) {
    MSource.init.call(this);
    setInterval(this.onInterval.bind(this), ms);
    this.out.$ = new OutPort("$", this);
  }

  private onInterval(): void {
    this.out.$.send(true, null);
  }
}
