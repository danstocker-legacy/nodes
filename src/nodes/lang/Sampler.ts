import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface ISamplerInputs<V> {
  /**
   * Input value to be sampled.
   */
  $: V;

  /**
   * Dictates sampling frequency. Output inherits the tag of the impulse
   * coming through this port.
   */
  smp: any;
}

interface ISamplerOutputs<V> {
  $: V;
}

/**
 * Emits the last known input value on every `smp` received.
 * The purpose of `Sampler` is to make untagged (or differently tagged) inputs
 * consumable by `Joiner`.
 * @example
 * const sampler = new Sampler<number>();
 * const ticker = new Ticker(1000);
 * const foo: ISource<{$: number}>; // emits tagged values
 * ticker.o.$.connect(sampler.i.$);
 * foo.o.$.connect(sampler.i.smp);
 * // `sampler` will output the last value from `ticker` on each input to `foo`
 */
export class Sampler<V> implements ISink, ISource {
  public readonly i: TInBundle<ISamplerInputs<V>>;
  public readonly o: TOutBundle<ISamplerOutputs<V>>;

  private buffer: V;

  constructor() {
    MSink.init.call(this, ["$", "smp"]);
    MSource.init.call(this, ["$"]);
  }

  public send(
    port: IInPort<ValueOf<ISamplerInputs<V>>>,
    value: ValueOf<ISamplerInputs<V>>,
    tag?: string
  ): void {
    const inPorts = this.i;
    switch (port) {
      case inPorts.$:
        this.buffer = value;
        break;

      case inPorts.smp:
        this.o.$.send(this.buffer, tag);
        break;
    }
  }
}
