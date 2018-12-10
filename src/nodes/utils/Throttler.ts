import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IThrottlerInputs {
  /** Signal to be throttled. */
  d_sig: any;

  ev_tick: boolean;
}

interface IThrottlerOutputs {
  /** Throttle signal. Emitted on each incoming signal. */
  d_thro: boolean;
}

/**
 * Emits a boolean with the last received input tag: `true` exactly on tick,
 * `false` on receiving a new input tag.
 * Atomic equivalent of a composite node.
 * Commonly used in conjunction with Picker and Folder.
 * Composite view:
 * TBD
 * @example
 * const throttler = new Throttler();
 * const ticker = new Ticker(1000);
 * ticker.o.ev_tick.connect(throttler.i.ev_tick);
 * throttler.i.d_sig.connect(...);
 * throttler.o.d_thro.connect(...);
 */
export class Throttler implements ISink, ISource {
  public readonly i: TInBundle<IThrottlerInputs>;
  public readonly o: TOutBundle<IThrottlerOutputs>;

  private readonly buffer: Array<string>;

  constructor() {
    MSink.init.call(this, ["d_sig", "ev_tick"]);
    MSource.init.call(this, ["d_thro"]);
    this.buffer = [];
  }

  public send(
    port: IInPort<ValueOf<IThrottlerInputs>>,
    value: ValueOf<IThrottlerInputs>,
    tag?: string
  ): void {
    const buffer = this.buffer;
    switch (port) {
      case this.i.ev_tick:
        // clock ticked
        // sending out last tag w/ true
        if (buffer.length) {
          this.o.d_thro.send(true, buffer.shift());
        }
        break;

      case this.i.d_sig:
        // new tag arrived
        buffer.push(tag);

        if (buffer.length > 1) {
          // there is a previous tag in buffer
          // sending out last tag w/ false
          this.o.d_thro.send(false, buffer.shift());
        }
        break;
    }
  }
}
