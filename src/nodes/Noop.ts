import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

interface IInputs<V> {
  d_val: V;
}

interface IOutputs<V> {
  d_val: V;
}

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * Equivalent to `Mapper<V>((value) => value)`;
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.i.d_val.send(5); // emits 5
 */
export class Noop<V> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_val"]);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.i.d_val) {
      this.o.d_val.send(input, tag);
    }
  }
}
