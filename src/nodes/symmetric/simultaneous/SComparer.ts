import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../../node";
import {IInPort, TInBundle, TOutBundle} from "../../../port";

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInputs<V> {
  /** First operand. */
  d_a: V;

  /** Second operand. */
  d_b: V;
}

interface ISComparerInputs<V> {
  /** Multiple inputs containing `d_a` and `d_b`. */
  i: IComparerInputs<V>;
}

interface ISComparerOutputs<V> {
  /** Equality of operands. */
  d_eq: boolean;

  /** Error message */
  ev_err: string;
}

/**
 * Compares two input values and sends `true` if they match according to the
 * specified equality callback, or `false` when they don't.
 * Atomic equivalent of a composite node.
 * TODO: Rename
 * Composite view:
 * TBD
 * @example
 * const comparer = new SComparer<number>((a, b) => a === b);
 * comparer.i.$.send({a: 4, b: 5}); // outputs `false`
 */
export class SComparer<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISComparerInputs<V>>;
  public readonly o: TOutBundle<ISComparerOutputs<V>>;
  public readonly b: TOutBundle<ISComparerInputs<V>>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_eq", "ev_err"]);
    MBouncer.init.call(this, ["i"]);
    this.cb = cb;
  }

  public send(
    port: IInPort<IComparerInputs<V>>,
    value: IComparerInputs<V>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      try {
        const equals = this.cb(value.d_a, value.d_b, tag);
        this.o.d_eq.send(equals, tag);
      } catch (err) {
        this.b.i.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
