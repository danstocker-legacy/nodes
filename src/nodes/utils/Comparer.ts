import {ISink, ISource, Sink, Source} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInputs<V> {
  a: V;
  b: V;
}

/**
 * Compares two input values and sends `true` if they match according to the
 * specified equality callback, or `false` when they don't.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const comparer = new Comparer<number>((a, b) => a === b);
 * comparer.in.$.send({a: 4, b: 5}); // outputs `false`
 */
export class Comparer<V> implements ISink, ISource {
  public readonly in: TInPorts<{
    $: IComparerInputs<V>;
  }>;
  public readonly out: TOutPorts<{
    $: boolean;
  }>;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    Sink.init.call(this, ["$"]);
    Source.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(
    port: IInPort<IComparerInputs<V>>,
    value: IComparerInputs<V>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      try {
        const equals = this.cb(value.a, value.b, tag);
        this.out.$.send(equals, tag);
      } catch (err) {
        // TODO: Bounce inputs
      }
    }
  }
}
