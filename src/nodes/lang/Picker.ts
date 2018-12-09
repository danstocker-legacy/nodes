import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IPickerInput<V> {
  /**
   * Value that may or may not be picked for forwarding.
   */
  $: V;

  /**
   * Whether to forward value ($).
   */
  st_fwd: boolean;
}

interface IPickerInputs<V> {
  $: IPickerInput<V>;
}

interface IPickerOutputs<V> {
  $: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Picker<V> implements ISink, ISource {
  public readonly i: TInBundle<IPickerInputs<V>>;
  public readonly o: TOutBundle<IPickerOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<IPickerInput<V>>, input: IPickerInput<V>, tag?: string): void {
    if (port === this.i.$ && input.st_fwd) {
      this.o.$.send(input.$, tag);
    }
  }
}
