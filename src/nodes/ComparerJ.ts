import {IBouncer, ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {Joiner} from "./Joiner";
import {
  IComparerInputs,
  IInputs,
  IOutputs,
  TEqualityCallback,
  UComparer
} from "./UComparer";

export class ComparerJ<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IComparerInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;
  public readonly b: TOutBundle<IInputs<V>>;

  constructor(cb: TEqualityCallback<V>) {
    const joiner = new Joiner<IComparerInputs<V>>(["d_a", "d_b"]);
    const comparer = new UComparer<V>(cb);
    joiner.o.o.connect(comparer.i.i);
    this.i = {
      d_a: joiner.i.d_a,
      d_b: joiner.i.d_b
    };
    this.o = {
      d_eq: comparer.o.d_eq,
      ev_err: comparer.o.ev_err
    };
    this.b = {
      i: comparer.b.i
    };
  }
}
