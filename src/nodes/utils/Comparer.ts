import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {FunctionStore} from "../../utils";

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

/**
 * Compares two input values and sends `true` if they match according to the
 * specified equality callback, or `false` when they don't.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const comparer = new Comparer<number>("(a, b) => a === b");
 * comparer.in.$.send({a: 4, b: 5}); // outputs `false`
 */
export class Comparer<V> implements ISink, ISource, IBouncer {
  public readonly in: TInBundle<IComparerInputs<V>>;
  public readonly out: TOutBundle<IComparerOutputs>;
  public readonly bounced: TOutBundle<IComparerInputs<V>>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: string) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = FunctionStore.get(cb);
  }

  public send(
    port: IInPort<IComparerInput<V>>,
    value: IComparerInput<V>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      try {
        const equals = this.cb(value.a, value.b, tag);
        this.out.$.send(equals, tag);
      } catch (err) {
        this.bounced.$.send(value, tag);
      }
    }
  }
}
