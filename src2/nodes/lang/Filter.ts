import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

interface IFilterInput<V> {
  val: V;
  incl: boolean;
}

interface IFilterInputs<V> {
  $: IFilterInput<V>;
}

interface IFilterOutputs<V> {
  $: V;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<V> implements ISink, ISource {
  public readonly in: TInPorts<IFilterInputs<V>>;
  public readonly out: TOutPorts<IFilterOutputs<V>>;

  constructor() {
    this.in = {
      $: new InPort("$", this)
    };
    this.out = {
      $: new OutPort("$", this)
    };
  }

  public send(port: IInPort<IFilterInput<V>>, input: IFilterInput<V>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
