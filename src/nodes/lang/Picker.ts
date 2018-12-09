import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IPickerInput<V> {
  /**
   * Value that may or may not be picked for forwarding.
   */
  d_val: V;

  /**
   * Whether to forward value ($).
   */
  st_fwd: boolean;
}

interface IPickerInputs<V> {
  sy: IPickerInput<V>;
}

interface IPickerOutputs<V> {
  d_val: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 * TODO: Allow to change st_fwd independently.
 */
export class Picker<V> implements ISink, ISource {
  public readonly i: TInBundle<IPickerInputs<V>>;
  public readonly o: TOutBundle<IPickerOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["sy"]);
    MSource.init.call(this, ["d_val"]);
  }

  public send(port: IInPort<IPickerInput<V>>, input: IPickerInput<V>, tag?: string): void {
    if (port === this.i.sy && input.st_fwd) {
      this.o.d_val.send(input.d_val, tag);
    }
  }
}
