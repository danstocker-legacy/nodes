import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny} from "../../utils";

interface ISplitterInputs<T> {
  $: T;
}

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.i.$.connect(A.out.$);
 * splitter.out.foo.connect(B.i.$);
 * splitter.out.bar.connect(C.i.$);
 */
export class Splitter<T extends IAny> implements ISink, ISource {
  public readonly i: TInBundle<ISplitterInputs<T>>;
  public readonly out: TOutBundle<T>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, fields);
  }

  public send(port: IInPort<T>, input: T, tag?: string): void {
    if (port === this.i.$) {
      for (const [name, value] of Object.entries(input)) {
        this.out[name].send(value, tag);
      }
    }
  }
}
