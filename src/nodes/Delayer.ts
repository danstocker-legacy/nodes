import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  d_val: V;
}

/**
 * Forwards input with the specified delay.
 */
export class Delayer<V> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;

  private readonly ms: number;

  /**
   * @param ms Delay in milliseconds.
   */
  constructor(ms: number) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_val"]);
    this.ms = ms;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.d_val) {
      setTimeout(() => this.o.d_val.send(value, tag), this.ms);
    }
  }
}
