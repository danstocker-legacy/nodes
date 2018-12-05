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
import {copy} from "../../utils";

interface IFolderInput<V> {
  /** Reset signal */
  res: boolean;

  /** Next input value */
  $: V;
}

interface IFolderInputs<V> {
  $: IFolderInput<V>;
}

interface IFolderOutputs<V> {
  $: V;
}

interface IFolderEvents {
  err: string;
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
export class Folder<I, O> implements ISink, ISource, IBouncer, IEvented {
  public readonly i: TInBundle<IFolderInputs<I>>;
  public readonly o: TOutBundle<IFolderOutputs<O>>;
  public readonly re: TOutBundle<IFolderInputs<I>>;
  public readonly e: TOutBundle<IFolderEvents>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    MEvented.init.call(this, ["err"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<IFolderInput<I>>,
    value: IFolderInput<I>,
    tag?: string
  ): void {
    if (port === this.i.$) {
      const next = value.$;
      const curr = value.res ?
        copy(this.initial) :
        this.folded;

      try {
        const folded = this.folded = this.cb(curr, next, tag);
        this.o.$.send(folded, tag);
      } catch (err) {
        this.re.$.send(value, tag);
        this.e.err.send(String(err), tag);
      }
    }
  }
}
