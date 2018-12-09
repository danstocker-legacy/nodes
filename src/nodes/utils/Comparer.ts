import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInput<V> {
  d_a: V;
  d_b: V;
}

interface IComparerInputs<V> {
  sync: IComparerInput<V>;
}

interface IComparerOutputs {
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
export class Comparer<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IComparerInputs<V>>;
  public readonly o: TOutBundle<IComparerOutputs>;
  public readonly re: TOutBundle<IComparerInputs<V>>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["sync"]);
    MSource.init.call(this, ["d_eq", "ev_err"]);
    MBouncer.init.call(this, ["sync"]);
    this.cb = cb;
  }

  public send(
    port: IInPort<IComparerInput<V>>,
    value: IComparerInput<V>,
    tag?: string
  ): void {
    if (port === this.i.sync) {
      try {
        const equals = this.cb(value.d_a, value.d_b, tag);
        this.o.d_eq.send(equals, tag);
      } catch (err) {
        this.re.sync.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
