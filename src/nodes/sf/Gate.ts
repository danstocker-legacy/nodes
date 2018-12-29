import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IGateInputs} from "../af/Gate";

export interface ISGateInputs<V> {
  /** Multiple inputs, including `d_val` and `st_open`. */
  i: IGateInputs<V>;
}

export interface ISGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;
}

/**
 * Forwards input value when gate is open. Bounces input when gate is
 * closed. Takes value and open state synchronously.
 * @example
 * const gate = new Gate<number>();
 * // emits 5 on `o.d_val`:
 * gate.i.i.send({st_open: true, val: 5}, "1");
 * // emits {st_open: false, val: 5} on `b.i`:
 * gate.i.i.send({st_open: false, val: 5}, "1");
 */
export class Gate<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISGateInputs<V>>;
  public readonly o: TOutBundle<ISGateOutputs<V>>;
  public readonly b: TOutBundle<ISGateInputs<V>>;

  constructor() {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_val"]);
    MBouncer.init.call(this, ["i"]);
  }

  public send(
    port: IInPort<IGateInputs<V>>,
    value: IGateInputs<V>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      if (value.st_open) {
        this.o.d_val.send(value.d_val, tag);
      } else {
        this.b.i.send(value, tag);
      }
    }
  }
}
