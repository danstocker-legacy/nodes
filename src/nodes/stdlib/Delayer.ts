import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IDelayerInputs<V> {
  $: V;
}

interface IDelayerOutputs<V> {
  $: V;
}

/**
 * Forwards input with the specified delay.
 */
export class Delayer<V> implements ISink, ISource {
  public readonly i: TInBundle<IDelayerInputs<V>>;
  public readonly out: TOutBundle<IDelayerOutputs<V>>;

  private readonly ms: number;

  /**
   * @param ms Delay in milliseconds.
   */
  constructor(ms: number) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.ms = ms;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.$) {
      setTimeout(() => this.out.$.send(value, tag), this.ms);
    }
  }
}
