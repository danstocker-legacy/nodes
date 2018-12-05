import {
  IBouncer,
  IEvented,
  ISink,
  ISource,
  MBouncer,
  MEvented,
  MSink,
  MSource
} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInput<V> {
  a: V;
  b: V;
}

interface IComparerInputs<V> {
  $: IComparerInput<V>;
}

interface IComparerOutputs {
  $: boolean;
}

interface IComparerEvents {
  err: string;
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
export class Comparer<V> implements ISink, ISource, IBouncer, IEvented {
  public readonly i: TInBundle<IComparerInputs<V>>;
  public readonly o: TOutBundle<IComparerOutputs>;
  public readonly re: TOutBundle<IComparerInputs<V>>;
  public readonly e: TOutBundle<IComparerEvents>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    MEvented.init.call(this, ["err"]);
    this.cb = cb;
  }

  public send(
    port: IInPort<IComparerInput<V>>,
    value: IComparerInput<V>,
    tag?: string
  ): void {
    if (port === this.i.$) {
      try {
        const equals = this.cb(value.a, value.b, tag);
        this.o.$.send(equals, tag);
      } catch (err) {
        this.re.$.send(value, tag);
        this.e.err.send(String(err), tag);
      }
    }
  }
}
