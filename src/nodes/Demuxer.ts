import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {IMuxed} from "../utils";

interface IDemuxerInputs<T> {
  /**
   * Multiplexed value.
   * Possible values of property `port` is one of the fields passed to
   * constructor.
   */
  d_mux: IMuxed<T>;
}

/**
 * De-multiplexes input.
 * Distributes impulses to output port specified by input.
 * @example
 * let demuxer: Demuxer<{d_foo: number, d_bar: boolean}>;
 * demuxer = new Demuxer(["d_foo", "d_bar"]);
 * demuxer.i.d_mux.send({port: "d_foo", val: 5});
 * // outputs `5` on port "d_foo"
 */
export class Demuxer<T> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IDemuxerInputs<T>>;
  public readonly o: TOutBundle<T>;
  public readonly b: TOutBundle<IDemuxerInputs<T>>;

  /**
   * @param fields Must be prefixed by their corresponding domains. ("d_" /
   * "st_" / "ev_": data, state, event, etc.)
   */
  constructor(fields: Array<string>) {
    MSink.init.call(this, ["d_mux"]);
    MSource.init.call(this, fields);
    MBouncer.init.call(this, ["d_mux"]);
  }

  public send(
    port: IInPort<IMuxed<T>>,
    value: IMuxed<T>,
    tag?: string
  ): void {
    if (port === this.i.d_mux) {
      const name = value.port;
      const o = this.o;
      if (o[name]) {
        o[name].send(value.val, tag);
      } else {
        this.b.d_mux.send(value, tag);
      }
    }
  }
}
