import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

export type TMapperCallback<I, O> = (value: I, tag?: string) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> implements ISink, ISource {
  public readonly in: TInPorts<{
    $: I;
  }>;
  public readonly out: TOutPorts<{
    $: O;
  }>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<I>, input: I, tag?: string): void {
    if (port === this.in.$) {
      try {
        const mapped = this.cb(input, tag);
        this.out.$.send(mapped, tag);
      } catch (err) {
        // TODO: Bounce inputs
      }
    }
  }
}
