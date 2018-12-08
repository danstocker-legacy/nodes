import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

interface IMapperInputs<V> {
  $: V;
}

interface IMapperOutputs<V> {
  $: V;
}

interface IMapperEvents {
  err: string;
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
  public readonly o: TOutBundle<IMapperOutputs<O> & IMapperEvents>;
  public readonly re: TOutBundle<IMapperInputs<I>>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$", "err"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    if (port === this.i.$) {
      try {
        const mapped = this.cb(value, tag);
        this.o.$.send(mapped, tag);
      } catch (err) {
        this.re.$.send(value, tag);
        this.o.err.send(String(err), tag);
      }
    }
  }
}
