import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

/**
 * Callback generator to be passed to an Unfolder.
 * Extracts the next unfolded item of the current aggregate value `curr`,
 * and determines whether unfolding the current value is done.
 */
export type TUnfolderCallback<I, O> = (value: I) => IterableIterator<O>;

interface IUnfolderInputs<V> {
  $: V;
}

interface IUnfolderOutputs<V> {
  $: V;
}

/**
 * Unfolds input values.
 * Emits several outputs for a single input.
 * Takes a generator function which extracts the next unfolded item from the
 * current aggregate value.
 * Sends 3 values to output: the next item, the index of the next item
 * within the aggregate, and whether unfolding the current aggregate is done.
 * @example
 * let flattener: Unfolder<Array<number>, number>;
 * flattener = new Unfolder((curr) => ({
 *   curr,
 *   done: curr.length === 1,
 *   next: curr.shift()
 * }));
 * @see {@link https://en.wikipedia.org/wiki/Anamorphism}
 */
export class Unfolder<I, O> implements ISink, ISource, IBouncer {
  public readonly in: TInBundle<IUnfolderInputs<I>>;
  public readonly out: TOutBundle<IUnfolderOutputs<O>>;
  public readonly bounced: TOutBundle<IUnfolderInputs<I>>;

  private readonly cb: TUnfolderCallback<I, O>;

  constructor(cb: TUnfolderCallback<I, O>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    try {
      const iterable = this.cb(value);
      for (const next of iterable) {
        this.out.$.send(next, tag);
      }
    } catch (err) {
      MBouncer.bounce.call(this, port, value, tag);
    }
  }
}
