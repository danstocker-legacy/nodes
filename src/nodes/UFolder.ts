import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {copy} from "../utils";
import {TFolderCallback} from "./Folder";

interface IFolderInputs<V> {
  /** Reset signal */
  d_res: boolean;

  /** Next input value */
  d_val: V;
}

export interface IInputs<V> {
  /** Multiple inputs, containing both `ev_red` and `d_val`. */
  i: IFolderInputs<V>;
}

export interface IOutputs<I, O> {
  /** Folded value */
  d_fold: O;

  /** Error message */
  ev_err: string;
}

/**
 * Folds input values into an aggregate.
 * Emits the next folded value for each input.
 * Takes a callback function which aggregates input values received since the
 * last reset signal.
 * @example
 * let sum: UFolder<number, number>;
 * sum = new UFolder((curr, next) => curr + next, 0);
 * @see {@link https://en.wikipedia.org/wiki/Catamorphism}
 */
export class UFolder<I, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<I>>;
  public readonly o: TOutBundle<IOutputs<I, O>>;
  public readonly b: TOutBundle<IInputs<I>>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_fold", "ev_err"]);
    MBouncer.init.call(this, ["i"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<IFolderInputs<I>>,
    value: IFolderInputs<I>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      try {
        const folded = this.cb(this.folded, value.d_val, tag);
        const res = value.d_res as boolean;
        if (res) {
          this.o.d_fold.send(folded, tag);
          this.folded = copy(this.initial);
        } else {
          this.folded = folded;
        }
      } catch (err) {
        this.b.i.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
