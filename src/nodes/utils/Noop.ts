import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * Equivalent to `Mapper<V>((value) => value)`;
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.in.$.send(5);
 */
export class Noop<V> implements ISink, ISource {
  public readonly in: TInBundle<{
    $: V;
  }>;
  public readonly out: TOutBundle<{
    $: V;
  }>;

  constructor() {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(input, tag);
    }
  }
}
