import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {IAny} from "../utils";

export interface IInputs<T> {
  /**
   * Multiple named values.
   * Names match the fields passed to constructor.
   */
  i: T;
}

export type TOutputs<T> = T;

/**
 * Splits synchronized sets into individual ports.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.i.i.connect(A.o.d_val);
 * splitter.o.foo.connect(B.i.d_val);
 * splitter.o.bar.connect(C.i.d_val);
 */
export class Splitter<T extends IAny> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<T>>;
  public readonly o: TOutBundle<TOutputs<T>>;

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
