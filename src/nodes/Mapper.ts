import {
  IAtomicSink,
  IBouncer,
  ISource,
  MBouncer,
  MSink,
  MSource
} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

export interface IInputs<V> {
  /** Value to be mapped */
  d_val: V;
}

export interface IOutputs<V> {
  /** Mapped value */
  d_val: V;

  /** Error message */
  ev_err: string;
}

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * const mapper = new Mapper<number, string>(String);
 * mapper.i.d_val.send(5, "1"); // o.d_val -> "5", "1"
 */
export class Mapper<I, O> implements IAtomicSink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<I>>;
  public readonly o: TOutBundle<IOutputs<O>>;
  public readonly b: TOutBundle<IInputs<I>>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_val", "ev_err"]);
    MBouncer.init.call(this, ["d_val"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    if (port === this.i.d_val) {
      try {
        const mapped = this.cb(value, tag);
        this.o.d_val.send(mapped, tag);
      } catch (err) {
        this.b.d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
