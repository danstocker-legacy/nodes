import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny, IMuxed} from "../../utils";

interface IMuxerOutputs<T> {
  /**
   * Multiplexed value.
   * Possible values of property `name` is one of the fields passed to
   * constructor.
   */
  d_mux: IMuxed<T>;
}

/**
 * Multiplexes inputs.
 * Channels impulses from all input ports into a single output port,
 * adding the input port's name.
 * @example
 * let muxer: Muxer<{d_foo: number, d_bar: boolean}>;
 * muxer = new Muxer(["fd_oo", "d_bar"]);
 * muxer.i.d_foo.send(5);
 * // outputs `{d_foo: 5, name: "foo"}` on port "d_mux"
 */
export class Muxer<T extends IAny = IAny> implements ISink, ISource {
  public readonly i: TInBundle<T>;
  public readonly o: TOutBundle<IMuxerOutputs<T>>;

  /**
   * @param fields Must be prefixed by their corresponding domains. ("d_" /
   * "st_" / "ev_": data, state, event, etc.)
   */
  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["d_mux"]);
  }

  public send(port: IInPort<T[keyof T]>, value: T[keyof T], tag?: string): void {
    const name = port.name;
    if (port === this.i[name]) {
      this.o.d_mux.send({name, val: value}, tag);
    }
  }
}
