import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface INoopInputs<V> {
  $: V;
}

interface INoopOutputs<V> {
  $: V;
}

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * Equivalent to `Mapper<V>((value) => value)`;
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.i.$.send(5);
 */
export class Noop<V> implements ISink, ISource {
  public readonly i: TInBundle<INoopInputs<V>>;
  public readonly o: TOutBundle<INoopOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.i.$) {
      this.o.$.send(input, tag);
    }
  }
}
