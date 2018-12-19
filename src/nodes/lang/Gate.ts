import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

export interface IGateInputs<V> {
  /** Value to be forwarded. */
  d_val: V;

  /** Whether gate should be open. */
  st_open: boolean;
}

export interface IGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Gate<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IGateInputs<V>>;
  public readonly o: TOutBundle<IGateOutputs<V>>;
  public readonly b: TOutBundle<Pick<IGateInputs<V>, "d_val">>;

  private open: boolean;

  constructor() {
    MSink.init.call(this, ["d_val", "st_open"]);
    MSource.init.call(this, ["d_val"]);
    MBouncer.init.call(this, ["d_val"]);
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IGateInputs<V>>>,
    value: ValueOf<IGateInputs<V>>,
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
        if (this.open) {
          this.o.d_val.send(val, tag);
        } else {
          this.b.d_val.send(val, tag);
        }
        break;
    }
  }
}
