import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IFilterInput<V> {
  $: V;
  incl: boolean;
}

interface IFilterInputs<V> {
  $: IFilterInput<V>;
}

interface IFilterOutputs<V> {
  $: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<V> implements ISink, ISource {
  public readonly in: TInBundle<IFilterInputs<V>>;
  public readonly out: TOutBundle<IFilterOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<IFilterInput<V>>, input: IFilterInput<V>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.$, tag);
    }
  }
}
