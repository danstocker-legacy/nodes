import {AtomicNode} from "../node";
import {IInPort, InPort, OutPort} from "../port";
import {IHash} from "../utils";
import {IMuxed} from "./IMuxed";

/**
 * Multiplexes inputs.
 * Channels impulses from all input ports into a single output port,
 * adding the input port's name.
 * @example
 * let muxer: Muxer<{foo: number, bar: boolean}>;
 * muxer = new Muxer(["foo", "bar"]);
 * muxer.in.foo.send(5);
 * // outputs `{val: 5, name: "foo"}` on port "$"
 */
export class Muxer<T extends IHash = IHash> extends AtomicNode<T, {
  $: IMuxed<T>;
}> {
  constructor(fields: Array<string>) {
    super();
    for (const field of fields) {
      this.in[field] = new InPort(field, this);
    }
    this.out.$ = new OutPort("$", this);
  }

  public send<U extends T[keyof T]>(port: IInPort<U>, input: U, tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      this.out.$.send({name, val: input}, tag);
    }
  }
}
