import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IAny, ValueOf} from "../../utils";

type TTrackerInputs<T> = T;

interface ITrackerOutputs<T> {
  $: T;
}

/**
 * Outputs sets of inputs, where each value in the set reflects the latest
 * one received through its corresponding port.
 * Atomic equivalent of a composite node.
 * A ----> $:Sampler:$ -+=> A,B:Syncer:$ -> $
 * B --> ev_smp:           |
 * B ----> $:Sampler:$ -+
 * A --> ev_smp:
 * @example
 * let tracker: Tracker<{ foo: number, bar: number }>
 * tracker = new Tracker(["foo", "bar"]);
 */
export class Tracker<T extends IAny> implements ISink, ISource {
  public readonly i: TInBundle<TTrackerInputs<T>>;
  public readonly o: TOutBundle<ITrackerOutputs<T>>;

  /**
   * Stores last input values.
   */
  private readonly values: T;

  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["$"]);
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
      this.o.$.send(values, tag);
    }
  }
}
