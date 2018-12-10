import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInput<V> {
  d_a: V;
  d_b: V;
}

interface IComparerInputs<V> {
  mul: IComparerInput<V>;
}

interface IComparerOutputs<V> {
  b_sync: IComparerInput<V>;
  d_eq: boolean;
  ev_err: string;
}

/**
 * Compares two input values and sends `true` if they match according to the
 * specified equality callback, or `false` when they don't.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const comparer = new Comparer<number>((a, b) => a === b);
 * comparer.i.$.send({a: 4, b: 5}); // outputs `false`
 */
export class Comparer<V> implements ISink, ISource {
  public readonly i: TInBundle<IComparerInputs<V>>;
  public readonly o: TOutBundle<IComparerOutputs<V>>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["mul"]);
    MSource.init.call(this, ["b_sync", "d_eq", "ev_err"]);
    this.cb = cb;
  }

  public send(
    port: IInPort<IComparerInput<V>>,
    value: IComparerInput<V>,
    tag?: string
  ): void {
    if (port === this.i.mul) {
      try {
        const equals = this.cb(value.d_a, value.d_b, tag);
        this.o.d_eq.send(equals, tag);
      } catch (err) {
        this.o.b_sync.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
