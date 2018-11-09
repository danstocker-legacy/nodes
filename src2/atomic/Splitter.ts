import {Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";
import {THash} from "../utils";

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.in.$.connect(A.out.$);
 * splitter.out.foo.connect(B.in.$);
 * splitter.out.bar.connect(C.in.$);
 */
export class Splitter<T extends THash> extends Node {
  public readonly in: TInPorts<{
    $: T
  }>;
  public readonly out: TOutPorts<T>;

  constructor(fields: Array<string>) {
    super();
    this.addPort(new InPort("$", this));
    for (const field of fields) {
      this.addPort(new OutPort(field, this));
    }
  }

  public send<U>(port: IInPort<U & T>, input: U & T, tag?: string): void {
    if (port === this.in.$) {
      for (const [name, value] of Object.entries(input)) {
        this.out[name].send(value, tag);
      }
    }
  }
}
