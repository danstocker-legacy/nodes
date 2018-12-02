import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface ITaggerInputs<V> {
  $: V;
  tag: any;
}

interface ITaggerOutputs<V> {
  $: V;
}

/**
 * Tags input values using a reference (tagged) input.
 * The purpose of Tagger is to attach tags to untagged (or differently
 * tagged) inputs so they can be fed into Joiner.
 * @example
 * const tagger = new Tagger<number>();
 * const ticker = new Ticker(1000);
 * const foo: ISource<{$: number}>; // emits tagged values
 * ticker.out.$.connect(tagger.in.$);
 * foo.out.$.connect(tagger.in.tag);
 * // `tagger` will output the last value from `ticker` on each input to `foo`
 */
export class Tagger<V> implements ISink, ISource {
  public readonly in: TInBundle<ITaggerInputs<V>>;
  public readonly out: TOutBundle<ITaggerOutputs<V>>;

  private buffer: V;

  constructor() {
    MSink.init.call(this, ["$", "tag"]);
    MSource.init.call(this, ["$"]);
  }

  public send(
    port: IInPort<ValueOf<ITaggerInputs<V>>>,
    value: ValueOf<ITaggerInputs<V>>,
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
