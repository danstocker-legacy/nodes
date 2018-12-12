import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IGateInput<V> {
  /** Value to be forwarded. */
  d_val: V;

  /** Whether gate is open. */
  st_open: boolean;
}

interface IGateInputs<V> {
  /** Multiple inputs, including `d_val` and `st_open`. */
  mul: IGateInput<V>;
}

interface IGateOutputs<V> {
  /** Forwarded value. */
  d_val: V;

  /** Bounced multiple inputs. */
  b_mul: IGateInput<V>;

  /** Bounced forwarded value. */
  b_d_val: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Gate<V> implements ISink, ISource {
  public readonly i: TInBundle<IGateInputs<V> & IGateInput<V>>;
  public readonly o: TOutBundle<IGateOutputs<V>>;

  private open: boolean;

  constructor() {
    MSink.init.call(this, ["mul", "d_val", "st_open"]);
    MSource.init.call(this, ["d_val", "b_mul", "b_d_val"]);
    this.open = false;
  }

  public send(
    port: IInPort<IGateInput<V> | V | boolean>,
    value: IGateInput<V> | V | boolean,
    tag?: string
  ): void {
    const i = this.i;
    let open;
    switch (port) {
      case i.mul:
        const mul = value as IGateInput<V>;
        open = this.open = mul.st_open;
        if (open) {
          this.o.d_val.send(mul.d_val, tag);
        } else {
          this.o.b_mul.send(mul, tag);
        }
        break;

      case i.st_open:
        open = value as boolean;
        this.open = open;
        break;

      case i.d_val:
        const val = value as V;
        if (this.open) {
          this.o.d_val.send(val, tag);
        } else {
          this.o.b_d_val.send(val, tag);
        }
        break;
    }
  }
}
