import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy} from "../../utils";

interface IFolderInput<V> {
  /** Reset signal */
  res: boolean;

  /** Next input value */
  $: V;
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
  public readonly in: TInBundle<{
    $: IFolderInput<I>;
  }>;
  public readonly out: TOutBundle<{
    $: O;
  }>;
  public readonly bounced: TOutBundle<{
    $: IFolderInput<I>;
  }>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
  }

  public send(
    port: IInPort<IFolderInput<I>>,
    value: IFolderInput<I>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      const next = value.$;
      const curr = value.res ?
        copy(this.initial) :
        this.folded;

      try {
        const folded = this.folded = this.cb(curr, next, tag);
        this.out.$.send(folded, tag);
      } catch (err) {
        MBouncer.bounce.call(this, port, value, tag);
      }
    }
  }
}
