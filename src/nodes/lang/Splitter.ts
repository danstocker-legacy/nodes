import {ISink, ISource, Sink, Source} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";
import {IAny} from "../../utils";

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.in.$.connect(A.out.$);
 * splitter.out.foo.connect(B.in.$);
 * splitter.out.bar.connect(C.in.$);
 */
export class Splitter<T extends IAny> implements ISink, ISource {
  public readonly in: TInPorts<{
    $: T;
  }>;
  public readonly out: TOutPorts<T>;

  constructor(fields: Array<string>) {
    Sink.init.call(this, ["$"]);
    Source.init.call(this, fields);
  }

  public send(port: IInPort<T>, input: T, tag?: string): void {
    if (port === this.in.$) {
      for (const [name, value] of Object.entries(input)) {
        this.out[name].send(value, tag);
      }
    }
  }
}
