import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export interface IGateInputs<V> {
  /** Value to be forwarded. */
  d_val: V;

  /** Whether gate should be open. */
  st_open: boolean;
}

export interface IGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;

  /** Bounced forwarded value. */
  b_d_val: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Gate<V> implements ISink, ISource {
  public readonly i: TInBundle<IGateInputs<V>>;
  public readonly o: TOutBundle<IGateOutputs<V>>;

  private open: boolean;

  constructor() {
    MSink.init.call(this, ["d_val", "st_open"]);
    MSource.init.call(this, ["d_val", "b_d_val"]);
    this.open = false;
  }

  public send(
    port: IInPort<V | boolean>,
    value: V | boolean,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.st_open:
        const open = value as boolean;
        this.open = open;
        break;

      case i.d_val:
        const val = value as V;
        const o = this.o;
        if (this.open) {
          o.d_val.send(val, tag);
        } else {
          o.b_d_val.send(val, tag);
        }
        break;
    }
  }
}
