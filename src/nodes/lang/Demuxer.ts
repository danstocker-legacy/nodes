import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IMuxed} from "../../utils";

/**
 * De-multiplexes input.
 * Distributes impulses to output port specified by input.
 * @example
 * let demuxer: Demuxer<{foo: number, bar: boolean}>;
 * demuxer = new Demuxer(["foo", "bar"]);
 * demuxer.in.$.send({name: "foo", 5});
 * // outputs `5` on port "foo"
 */
export class Demuxer<T> implements ISink, ISource {
  public readonly in: TInBundle<{
    $: IMuxed<T>;
  }>;
  public readonly out: TOutBundle<T>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, fields);
  }

  public send(port: IInPort<IMuxed<T>>, input: IMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.$, tag);
    }
  }
}
