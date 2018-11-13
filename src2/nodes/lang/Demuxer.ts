import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";
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
 * demuxer.in.$.send({name: "foo", 5});
 * // outputs `5` on port "foo"
 */
export class Demuxer<T> implements ISink<{ $: IMuxed<T>; }>, ISource<T> {
  public readonly in: TInPorts<{ $: IMuxed<T>; }>;
  public readonly out: TOutPorts<T>;

  constructor(fields: Array<string>) {
    this.in = {
      $: new InPort("$", this)
    };
    this.out = <TOutPorts<T>> {};
    for (const field of fields) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send(port: IInPort<IMuxed<T>>, input: IMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.val, tag);
    }
  }
}
