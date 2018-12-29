import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy} from "../../utils";
import {IFolderInputs, TFolderCallback} from "../af/Folder";

interface ISFolderInput<V> {
  /** Reset signal */
  d_res: boolean;

  /** Next input value */
  d_val: V;
}

export interface ISFolderInputs<V> {
  /** Multiple inputs, containing both `ev_red` and `d_val`. */
  i: ISFolderInput<V>;
}

export interface ISFolderOutputs<I, O> {
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
 * let sum: Folder<number, number>;
 * sum = new Folder((curr, next) => curr + next, 0);
 * @see {@link https://en.wikipedia.org/wiki/Catamorphism}
 */
export class Folder<I, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISFolderInputs<I>>;
  public readonly o: TOutBundle<ISFolderOutputs<I, O>>;
  public readonly b: TOutBundle<ISFolderInputs<I>>;

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
    port: IInPort<ISFolderInput<I>>,
    value: ISFolderInput<I>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      const res = value.d_res as boolean;
      let curr = res ?
        copy(this.initial) :
        this.folded;

      try {
        curr = this.folded = this.cb(curr, value.d_val, tag);
        if (res) {
          this.o.d_fold.send(curr, tag);
        }
      } catch (err) {
        this.b.i.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
