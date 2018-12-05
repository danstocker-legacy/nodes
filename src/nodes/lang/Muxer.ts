import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny, IMuxed} from "../../utils";

interface IMuxerOutputs<T> {
  $: IMuxed<T>;
}

/**
 * Multiplexes inputs.
 * Channels impulses from all input ports into a single output port,
 * adding the input port's name.
 * @example
 * let muxer: Muxer<{foo: number, bar: boolean}>;
 * muxer = new Muxer(["foo", "bar"]);
 * muxer.i.foo.send(5);
 * // outputs `{$: 5, name: "foo"}` on port "$"
 */
export class Muxer<T extends IAny = IAny> implements ISink, ISource {
  public readonly i: TInBundle<T>;
  public readonly out: TOutBundle<IMuxerOutputs<T>>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<T[keyof T]>, input: T[keyof T], tag?: string): void {
    const name = port.name;
    if (port === this.i[name]) {
      this.out.$.send({name, $: input}, tag);
    }
  }
}
