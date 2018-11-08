import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";
import {THash} from "../utils";

/**
 * Splits synchronized values sets.
 * @example
 * const splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.in.$.connect(A.out.$);
 * splitter.out.foo.connect(B.in.$);
 * splitter.out.bar.connect(C.in.$);
 */
export class Splitter<T extends THash> extends Node {
  public readonly in: TStaticInPorts<{
    $: T
  }>;
  public readonly out: TStaticOutPorts<T>;

  constructor(fields: Array<string>) {
    super();
    this.addPort(new StaticInPort("$", this));
    for (const field of fields) {
      this.addPort(new StaticOutPort(field, this));
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
