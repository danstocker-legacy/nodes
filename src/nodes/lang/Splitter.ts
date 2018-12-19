import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny} from "../../utils";

interface ISplitterInputs<T> {
  /**
   * Multiple named values.
   * Names match the fields passed to constructor.
   */
  i: T;
}

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.i.$.connect(A.o.$);
 * splitter.o.foo.connect(B.i.$);
 * splitter.o.bar.connect(C.i.$);
 */
export class Splitter<T extends IAny> implements ISink, ISource {
  public readonly i: TInBundle<ISplitterInputs<T>>;
  public readonly o: TOutBundle<T>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, fields);
  }

  public send(port: IInPort<T>, input: T, tag?: string): void {
    if (port === this.i.i) {
      for (const [name, value] of Object.entries(input)) {
        this.o[name].send(value, tag);
      }
    }
  }
}
