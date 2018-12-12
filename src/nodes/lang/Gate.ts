import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IGateInput<V> {
  /** Value to be forwarded. */
  d_val: V;

  /** Whether to forward value. */
  st_open: boolean;
}

interface IGateInputs<V> {
  /** Multiple inputs, including `d_val` and `st_open`. */
  mul: IGateInput<V>;
}

interface IGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 * TODO: Allow to change st_open independently.
 */
export class Gate<V> implements ISink, ISource {
  public readonly i: TInBundle<IGateInputs<V>>;
  public readonly o: TOutBundle<IGateOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["mul"]);
    MSource.init.call(this, ["d_val"]);
  }

  public send(port: IInPort<IGateInput<V>>, input: IGateInput<V>, tag?: string): void {
    if (port === this.i.mul && input.st_open) {
      this.o.d_val.send(input.d_val, tag);
    }
  }
}
