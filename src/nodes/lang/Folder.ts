import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy} from "../../utils";

export interface IFolderInputs<V> {
  /** Reset signal */
  ev_res: boolean;

  /** Next input value */
  d_val: V;
}

export interface IFolderOutputs<I, O> {
  /** Bounced input value. */
  b_d_val: I;

  /** Folded value */
  d_fold: O;

  /** Error message */
  ev_err: string;
}

export type TFolderCallback<I, O> = (
  curr: O,
  next: I,
  tag?: string) => O;

/**
 * Folds input values into an aggregate.
 * Emits the next folded value for each input.
 * Takes a callback function which aggregates input values received since the
 * last reset signal.
 * @example
 * let sum: Folder<number, number>;
 * sum = new Folder((curr, next) => curr + next, 0);
 * @see {@link https://en.wikipedia.org/wiki/Catamorphism}
 */
export class Folder<I, O> implements ISink, ISource {
  public readonly i: TInBundle<IFolderInputs<I>>;
  public readonly o: TOutBundle<IFolderOutputs<I, O>>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["d_val", "ev_res"]);
    MSource.init.call(this, ["b_d_val", "d_fold", "ev_err"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<I | boolean>,
    value: I | boolean,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.d_val:
        const val = value as I;
        try {
          const folded = this.folded = this.cb(this.folded, val, tag);
          this.o.d_fold.send(folded, tag);
        } catch (err) {
          this.o.b_d_val.send(val, tag);
          this.o.ev_err.send(String(err), tag);
        }
        break;

      case i.ev_res:
        this.folded = copy(this.initial);
        break;
    }
  }
}
