import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TFilterCallback<V> = (value: V, tag?: string) => boolean;

interface IFilterInputs<V> {
  /** Value to be filtered. */
  d_val: V;
}

interface IFilterOutputs<V> {
  /** Filtered output. */
  d_val: V;

  /** Error message. */
  ev_err: string;
}

/**
 * Forwards input that satisfies the specified tester callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * d_val -> d_val:Mapper:d_val -> d_val:Gate:d_val -> d_val:Mapper:d_val -> d_val
 * @example
 * const filter = new Filter<number>((a) => a%2);
 * filter.i.d_val.send(1); // outputs 1
 * filter.i.d_val.send(2); // will not output
 */
export class Filter<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IFilterInputs<V>>;
  public readonly o: TOutBundle<IFilterOutputs<V>>;
  public readonly b: TOutBundle<IFilterInputs<V>>;

  private readonly cb: TFilterCallback<V>;

  constructor(cb: TFilterCallback<V>) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_val", "ev_err"]);
    MBouncer.init.call(this, ["d_val"]);
    this.cb = cb;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.d_val) {
      try {
        const include = this.cb(value, tag);
        if (include) {
          this.o.d_val.send(value, tag);
        }
      } catch (err) {
        this.b.d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
