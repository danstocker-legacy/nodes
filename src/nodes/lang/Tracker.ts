import {ISink, ISource, Sink, Source} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";
import {IAny} from "../../utils";

interface ITrackerOutputs<T> {
  $: T;
}

/**
 * Outputs sets of inputs, where each value in the set reflects the latest
 * one received through its corresponding port.
 * @example
 * let tracker: Tracker<{ foo: number, bar: number }>
 * tracker = new Tracker(["foo", "bar"]);
 */
export class Tracker<T extends IAny = IAny> implements ISink, ISource {
  public readonly in: TInPorts<T>;
  public readonly out: TOutPorts<ITrackerOutputs<T>>;

  private readonly values: T;

  constructor(fields: Array<string>) {
    Sink.init.call(this, fields);
    Source.init.call(this, ["$"]);
    this.values = {} as T;
  }

  public send(port: IInPort<T[keyof T]>, input: T[keyof T], tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      const values = this.values;
      values[name] = input;
      this.out.$.send(values, tag);
    }
  }
}
