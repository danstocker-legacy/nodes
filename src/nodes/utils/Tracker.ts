import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny, ValueOf} from "../../utils";

type TTrackerInputs<T> = T;

interface ITrackerOutputs<T> {
  mul: T;
}

/**
 * Outputs sets of inputs, where each value in the set reflects the latest
 * one received through its corresponding port.
 * Atomic equivalent of a composite node.
 * d_A ---> d_val:Sampler:$ -+=> d_A,d_B:Joiner:mul -> mul
 * d_B --> ev_smp:"          |
 * d_B ---> d_val:Sampler:$ -+
 * d_A --> ev_smp:"
 * @example
 * let tracker: Tracker<{ d_foo: number, d_bar: number }>
 * tracker = new Tracker(["d_foo", "d_bar"]);
 * tracker.i.b_foo.send(5, "2");    // mul -> {b_foo: 5, b_bar: undefined}, "2"
 * tracker.i.b_bar.send(true, "1"); // mul -> {b_foo: 5, b_bar: true}, "1"
 */
export class Tracker<T extends IAny> implements ISink, ISource {
  public readonly i: TInBundle<TTrackerInputs<T>>;
  public readonly o: TOutBundle<ITrackerOutputs<T>>;

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
    MSource.init.call(this, ["mul"]);
    this.values = {} as T;
  }

  public send(
    port: IInPort<ValueOf<TTrackerInputs<T>>>,
    input: ValueOf<TTrackerInputs<T>>,
    tag?: string
  ): void {
    const name = port.name;
    if (port === this.i[name]) {
      const values = this.values;
      values[name] = input;
      this.o.mul.send(values, tag);
    }
  }
}
