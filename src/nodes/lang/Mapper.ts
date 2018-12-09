import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

interface IMapperInputs<V> {
  d_val: V;
}

interface IMapperOutputs<V> {
  d_val: V;
  ev_err: string;
}

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IMapperInputs<I>>;
  public readonly o: TOutBundle<IMapperOutputs<O>>;
  public readonly re: TOutBundle<IMapperInputs<I>>;

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
        this.re.d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
