import {AtomicNode} from "../node";
import {IInPort, InPort, OutPort} from "../port";
import {IMuxed} from "./IMuxed";

/**
 * De-multiplexes input.
 * Distributes impulses to output port specified by input.
 * @example
 * let demuxer: Demuxer<{foo: number, bar: boolean}>;
 * demuxer = new Demuxer(["foo", "bar"]);
 * demuxer.in.$.send({name: "foo", 5});
 * // outputs `5` on port "foo"
 */
export class Demuxer<T> extends AtomicNode<{
  $: IMuxed<T>;
}, T> {
  constructor(fields: Array<string>) {
    super();
    this.in.$ = new InPort("$", this);
    for (const field of fields) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send<U>(port: IInPort<U & IMuxed<T>>, input: U & IMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.val, tag);
    }
  }
}
