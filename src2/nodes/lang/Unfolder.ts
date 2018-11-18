import {
  ErrorSource,
  EventSource,
  IErrorSource,
  IEventSource,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
  TErrorPorts,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

/**
 * Callback to be passed to an Unfolder.
 * Extracts the next unfolded item of the current aggregate value `curr`,
 * and determines whether unfolding the current value is done.
 */
type TUnfolderCallback<I, O> = (curr: I, idx: number, tag?: string) =>
  { next: O, curr: I, done: boolean };

/**
 * Unfolds input values.
 * Emits several outputs for a single input.
 * Takes a callback function which extracts the next unfolded item from the
 * current aggregate value, and determines whether the unfolding process is
 * done.
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
export class Unfolder<I, O> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: I
  }>;
  public readonly out: TOutPorts<{
    $: {
      /** Whether unfolding the current aggregate value has completed. */
      done: boolean,

      /** Index of next item within the aggregate input. */
      idx: number,

      /** Next unfolded item. */
      val: O
    }
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes | "CALLBACK_ERROR">;

  private readonly cb: TUnfolderCallback<I, O>;

  constructor(cb: TUnfolderCallback<I, O>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    for (let i = 0; true; i++) {
      try {
        const {next, curr, done} = this.cb(value, i, tag);
        value = curr;
        this.out.$.send({
          done,
          idx: i,
          val: next
        }, tag);
        if (done) {
          break;
        }
      } catch (err) {
        this.svc.err.send({
          payload: {
            err,
            node: this
          },
          type: "CALLBACK_ERROR"
        }, tag);
        break;
      }
    }
  }
}
