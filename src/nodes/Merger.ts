import {IAtomicSink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {IAny, ValueOf} from "../utils";

export type TInputs<T> = T;

export interface IOutputs<T> {
  o: T;
}

/**
 * Outputs sets of inputs, where each value in the set reflects the latest
 * one received through its corresponding port.
 * Atomic equivalent of a composite node.
 * d_A ---> d_val:Sampler:$ -+=> d_A,d_B:Joiner:o -> o
 * d_B --> ev_smp:"          |
 * d_B ---> d_val:Sampler:$ -+
 * d_A --> ev_smp:"
 * @example
 * let merger: Merger<{ d_foo: number, d_bar: number }>
 * merger = new Merger(["d_foo", "d_bar"]);
 * merger.i.d_foo.send(5, "2");    // o -> {d_foo: 5, d_bar: undefined}, "2"
 * merger.i.d_bar.send(true, "1"); // o -> {d_foo: 5, d_bar: true}, "1"
 */
export class Merger<T extends IAny> implements IAtomicSink, ISource {
  public readonly i: TInBundle<TInputs<T>>;
  public readonly o: TOutBundle<IOutputs<T>>;

  /**
   * Stores last input values.
   */
  private readonly values: T;

  /**
   * @param fields Must be prefixed by their corresponding domains. ("d_" /
   * "st_" / "ev_": data, state, event, etc.)
   */
  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["o"]);
    this.values = {} as T;
  }

  public send(
    port: IInPort<ValueOf<TInputs<T>>>,
    input: ValueOf<TInputs<T>>,
    tag?: string
  ): void {
    const name = port.name;
    if (port === this.i[name]) {
      const values = this.values;
      values[name] = input;
      this.o.o.send(values, tag);
    }
  }
}
