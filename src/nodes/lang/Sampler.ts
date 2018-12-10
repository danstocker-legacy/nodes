import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface ISamplerInputs<V> {
  /** Value to be sampled. */
  d_val: V;

  /** Sampling impulse. Output inherits the tag. */
  ev_smp: any;
}

interface ISamplerOutputs<V> {
  /** Sampled value. */
  d_val: V;
}

/**
 * Emits the last known input value on every `ev_smp` received.
 * The purpose of `Sampler` is to make untagged (or differently tagged) inputs
 * consumable by `Joiner`.
 * @example
 * const sampler = new Sampler<number>();
 * const ticker = new Ticker(1000);
 * const foo: ISource<{$: number}>; // emits tagged values
 * ticker.o.$.connect(sampler.i.$);
 * foo.o.$.connect(sampler.i.ev_smp);
 * // `sampler` will output the last value from `ticker` on each input to `foo`
 */
export class Sampler<V> implements ISink, ISource {
  public readonly i: TInBundle<ISamplerInputs<V>>;
  public readonly o: TOutBundle<ISamplerOutputs<V>>;

  private buffer: V;

  constructor() {
    MSink.init.call(this, ["d_val", "ev_smp"]);
    MSource.init.call(this, ["d_val"]);
  }

  public send(
    port: IInPort<ValueOf<ISamplerInputs<V>>>,
    value: ValueOf<ISamplerInputs<V>>,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.d_val:
        this.buffer = value;
        break;

      case i.ev_smp:
        this.o.d_val.send(this.buffer, tag);
        break;
    }
  }
}
