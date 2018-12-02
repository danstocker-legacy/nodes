import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {copy, IAny, ValueOf} from "../../utils";

interface ITagInputs {
  tag: any;
}

type TTrackerInputs<T> = T & ITagInputs;

interface ITrackerOutputs<T> {
  $: T;
}

/**
 * Outputs sets of inputs, where each value in the set reflects the latest
 * one received through its corresponding port.
 * Atomic equivalent of a composite node.
 * A ---+=> Sampler -+=> Joiner -> $
 * B ---+=> Sampler -+
 * C ---+=> Sampler -+
 * ref -+
 * @example
 * let tracker: Tracker<{ foo: number, bar: number }>
 * tracker = new Tracker(["foo", "bar"]);
 */
export class Tracker<T extends IAny = IAny> implements ISink, ISource {
  public readonly in: TInBundle<TTrackerInputs<T>>;
  public readonly out: TOutBundle<ITrackerOutputs<T>>;

  /**
   * Stores last input values.
   */
  private readonly values: T;

  constructor(fields: Array<string>) {
    MSink.init.call(this, fields.concat("tag"));
    MSource.init.call(this, ["$"]);
    this.values = {} as T;
  }

  public send(
    port: IInPort<ValueOf<TTrackerInputs<T>>>,
    input: ValueOf<TTrackerInputs<T>>,
    tag?: string
  ): void {
    const inPorts = this.in;
    const values = this.values;
    const name = port.name;
    if (port === inPorts.tag) {
      // sending shallow copy of current state
      this.out.$.send(copy(values), tag);
    } else if (port === this.in[name]) {
      // not the tag port, but it exists in node
      // updating input in state
      values[name] = input;
    }
  }
}
