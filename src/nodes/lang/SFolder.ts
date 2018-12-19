import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy} from "../../utils";
import {IFolderInputs, TFolderCallback} from "./Folder";

export interface ISFolderInputs<V> {
  /** Multiple inputs, containing both `ev_red` and `d_val`. */
  mul: IFolderInputs<V>;
}

export interface ISFolderOutputs<I, O> {
  /** Bounced multiple inputs. */
  b_mul: IFolderInputs<I>;

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
 * let sum: SFolder<number, number>;
 * sum = new SFolder((curr, next) => curr + next, 0);
 * @see {@link https://en.wikipedia.org/wiki/Catamorphism}
 */
export class SFolder<I, O> implements ISink, ISource {
  public readonly i: TInBundle<ISFolderInputs<I>>;
  public readonly o: TOutBundle<ISFolderOutputs<I, O>>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["mul"]);
    MSource.init.call(this, ["b_mul", "d_fold", "ev_err"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<IFolderInputs<I>>,
    value: IFolderInputs<I>,
    tag?: string
  ): void {
    if (port === this.i.mul) {
      const curr = value.ev_res ?
        copy(this.initial) :
        this.folded;

      try {
        const folded = this.folded = this.cb(curr, value.d_val, tag);
        this.o.d_fold.send(folded, tag);
      } catch (err) {
        this.o.b_mul.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
