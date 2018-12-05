import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IThrottlerInputs {
  tag: any;
  tick: boolean;
}

interface IThrottlerOutputs {
  $: boolean;
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
 * ticker.o.$.connect(throttler.i.tick);
 * throttler.i.tag.connect(...);
 * throttler.o.$.connect(...);
 */
export class Throttler implements ISink, ISource {
  public readonly i: TInBundle<IThrottlerInputs>;
  public readonly o: TOutBundle<IThrottlerOutputs>;

  private readonly buffer: Array<string>;

  constructor() {
    MSink.init.call(this, ["tag", "tick"]);
    MSource.init.call(this, ["$"]);
    this.buffer = [];
  }

  public send(
    port: IInPort<ValueOf<IThrottlerInputs>>,
    value: ValueOf<IThrottlerInputs>,
    tag?: string
  ): void {
    const buffer = this.buffer;
    switch (port) {
      case this.i.tick:
        // clock ticked
        // sending out last tag w/ true
        if (buffer.length) {
          this.o.$.send(true, buffer.shift());
        }
        break;

      case this.i.tag:
        // new tag arrived
        buffer.push(tag);

        if (buffer.length > 1) {
          // there is a previous tag in buffer
          // sending out last tag w/ false
          this.o.$.send(false, buffer.shift());
        }
        break;
    }
  }
}
