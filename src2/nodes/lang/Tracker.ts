import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";
import {IHash} from "../../utils";

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
export class Tracker<T extends IHash = IHash> implements ISink<T>, ISource<ITrackerOutputs<T>> {
  public readonly in: TInPorts<T>;
  public readonly out: TOutPorts<ITrackerOutputs<T>>;

  private readonly values: T;

  constructor(fields: Array<string>) {
    this.values = <T> {};
    this.in = <TInPorts<T>> {};
    for (const field of fields) {
      this.in[field] = new InPort(field, this);
    }
    this.out = {
      $: new OutPort("$", this)
    };
  }

  public send<U>(port: IInPort<U>, input: U, tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      const values = this.values;
      values[name] = input;
      this.out.$.send(values, tag);
    }
  }
}
