import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IMuxed} from "../../utils";

interface IDemuxerInputs<T> {
  $: IMuxed<T>;
}

/**
 * De-multiplexes input.
 * Distributes impulses to output port specified by input.
 * @example
 * let demuxer: Demuxer<{foo: number, bar: boolean}>;
 * demuxer = new Demuxer(["foo", "bar"]);
 * demuxer.i.$.send({name: "foo", 5});
 * // outputs `5` on port "foo"
 */
export class Demuxer<T> implements ISink, ISource {
  public readonly i: TInBundle<IDemuxerInputs<T>>;
  public readonly out: TOutBundle<T>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, fields);
  }

  public send(port: IInPort<IMuxed<T>>, input: IMuxed<T>, tag?: string): void {
    if (port === this.i.$) {
      const name = input.name;
      this.out[name].send(input.$, tag);
    }
  }
}
