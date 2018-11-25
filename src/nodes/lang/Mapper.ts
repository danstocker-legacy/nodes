import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> implements ISink, ISource, IBouncer {
  public readonly in: TInBundle<{
    $: I;
  }>;
  public readonly out: TOutBundle<{
    $: O;
  }>;
  public readonly bounced: TOutBundle<{
    $: I;
  }>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, value: I, tag?: string): void {
    if (port === this.in.$) {
      try {
        const mapped = this.cb(value, tag);
        this.out.$.send(mapped, tag);
      } catch (err) {
        MBouncer.bounce.call(this, port, value, tag);
      }
    }
  }
}
