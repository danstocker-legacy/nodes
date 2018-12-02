import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface ISamplerInputs<V> {
  $: V;
  tag: any;
}

interface ISamplerOutputs<V> {
  $: V;
}

/**
 * Emits the last known input value on every tag received.
 * The purpose of `Sampler` is to make untagged (or differently tagged) inputs
 * consumable by `Joiner`.
 * @example
 * const sampler = new Sampler<number>();
 * const ticker = new Ticker(1000);
 * const foo: ISource<{$: number}>; // emits tagged values
 * ticker.out.$.connect(sampler.in.$);
 * foo.out.$.connect(sampler.in.tag);
 * // `sampler` will output the last value from `ticker` on each input to `foo`
 */
export class Sampler<V> implements ISink, ISource {
  public readonly in: TInBundle<ISamplerInputs<V>>;
  public readonly out: TOutBundle<ISamplerOutputs<V>>;

  private buffer: V;

  constructor() {
    MSink.init.call(this, ["$", "tag"]);
    MSource.init.call(this, ["$"]);
  }

  public send(
    port: IInPort<ValueOf<ISamplerInputs<V>>>,
    value: ValueOf<ISamplerInputs<V>>,
    tag?: string
  ): void {
    const inPorts = this.in;
    switch (port) {
      case inPorts.$:
        this.buffer = value;
        break;

      case inPorts.tag:
        this.out.$.send(this.buffer, tag);
        break;
    }
  }
}
