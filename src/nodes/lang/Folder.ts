import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy} from "../../utils";

interface IFolderInput<V> {
  /** Reset signal */
  ev_res: boolean;

  /** Next input value */
  d_val: V;
}

interface IFolderInputs<V> {
  sy: IFolderInput<V>;
}

interface IFolderOutputs<V> {
  d_fol: V;
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
export class Folder<I, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IFolderInputs<I>>;
  public readonly o: TOutBundle<IFolderOutputs<O>>;
  public readonly re: TOutBundle<IFolderInputs<I>>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["sy"]);
    MSource.init.call(this, ["d_fol", "ev_err"]);
    MBouncer.init.call(this, ["sy"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<IFolderInput<I>>,
    value: IFolderInput<I>,
    tag?: string
  ): void {
    if (port === this.i.sy) {
      const next = value.d_val;
      const curr = value.ev_res ?
        copy(this.initial) :
        this.folded;

      try {
        const folded = this.folded = this.cb(curr, next, tag);
        this.o.d_fol.send(folded, tag);
      } catch (err) {
        this.re.sy.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
