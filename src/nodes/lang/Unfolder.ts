import {
  ErrorSource,
  IErrorSource,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source
} from "../../node";
import {IInPort, TErrorPorts, TInPorts, TOutPorts} from "../../port";

/**
 * Callback generator to be passed to an Unfolder.
 * Extracts the next unfolded item of the current aggregate value `curr`,
 * and determines whether unfolding the current value is done.
 */
export type TUnfolderCallback<I, O> = (value: I) => IterableIterator<O>;

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
export class Unfolder<I, O> implements ISink, ISource, IErrorSource {
  public readonly in: TInPorts<{
    $: I
  }>;
  public readonly out: TOutPorts<{
    $: O
  }>;
  public readonly svc: TErrorPorts<"CALLBACK_ERROR">;

  private readonly cb: TUnfolderCallback<I, O>;

  constructor(cb: TUnfolderCallback<I, O>) {
    Sink.init.call(this, ["$"]);
    Source.init.call(this, ["$"]);
    Serviced.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    try {
      const iterable = this.cb(value);
      for (const next of iterable) {
        this.out.$.send(next, tag);
      }
    } catch (err) {
      this.svc.err.send({
        payload: {
          err,
          node: this
        },
        type: "CALLBACK_ERROR"
      }, tag);
    }
  }
}
