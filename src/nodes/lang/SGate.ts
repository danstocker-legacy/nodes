import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IGateInputs} from "./Gate";

export interface ISGateInputs<V> {
  /** Multiple inputs, including `d_val` and `st_open`. */
  i: IGateInputs<V>;
}

export interface ISGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;

  /** Bounced multiple inputs. */
  b_i: IGateInputs<V>;
}

export class SGate<V> implements ISink, ISource {
  public readonly i: TInBundle<ISGateInputs<V>>;
  public readonly o: TOutBundle<ISGateOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_val", "b_i"]);
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
        this.o.b_i.send(value, tag);
      }
    }
  }
}
