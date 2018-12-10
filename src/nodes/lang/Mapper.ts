import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

interface IMapperInputs<V> {
  /** Value to be mapped */
  d_val: V;
}

interface IMapperOutputs<I, O> {
  /** Bounced input value */
  b_d_val: I;

  /** Mapped value */
  d_val: O;

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
export class Mapper<I, O> implements ISink, ISource {
  public readonly i: TInBundle<IMapperInputs<I>>;
  public readonly o: TOutBundle<IMapperOutputs<I, O>>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["b_d_val", "d_val", "ev_err"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    if (port === this.i.d_val) {
      try {
        const mapped = this.cb(value, tag);
        this.o.d_val.send(mapped, tag);
      } catch (err) {
        this.o.b_d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
