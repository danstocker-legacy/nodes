import {
  IAtomicSink,
  IBouncer,
  ISource,
  MBouncer,
  MSink,
  MSource
} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

/**
 * Callback generator to be passed to an Unfolder.
 * Extracts the next unfolded item of the current aggregate value `curr`,
 * and determines whether unfolding the current value is done.
 */
export type TUnfolderCallback<I, O> = (value: I) => IterableIterator<O>;

export interface IInputs<V> {
  /** Folded value. */
  d_fold: V;
}

export interface IOutputs<I, O> {
  /** Unfolded value. */
  d_val: O;

  /** Error message. */
  ev_err: string;
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
export class Unfolder<I, O> implements IAtomicSink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<I>>;
  public readonly o: TOutBundle<IOutputs<I, O>>;
  public readonly b: TOutBundle<IInputs<I>>;

  private readonly cb: TUnfolderCallback<I, O>;

  constructor(cb: TUnfolderCallback<I, O>) {
    MSink.init.call(this, ["d_fold"]);
    MSource.init.call(this, ["d_val", "ev_err"]);
    MBouncer.init.call(this, ["d_fold"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    try {
      const iterable = this.cb(value);
      for (const next of iterable) {
        this.o.d_val.send(next, tag);
      }
    } catch (err) {
      this.b.d_fold.send(value, tag);
      this.o.ev_err.send(String(err), tag);
    }
  }
}