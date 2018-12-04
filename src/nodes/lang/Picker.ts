import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IPickerInput<V> {
  $: V;
  include: boolean;
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
  public readonly in: TInBundle<IPickerInputs<V>>;
  public readonly out: TOutBundle<IPickerOutputs<V>>;

  constructor() {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
  }

  public send(port: IInPort<IPickerInput<V>>, input: IPickerInput<V>, tag?: string): void {
    if (port === this.in.$ && input.include) {
      this.out.$.send(input.$, tag);
    }
  }
}
