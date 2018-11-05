import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

type FilterInput<T> = { val: T, incl: boolean };

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<T> extends Node {
  public readonly in: TStaticInPorts<{
    $: FilterInput<T>
  }>;
  public readonly out: TStaticOutPorts<{
    $: T
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("$", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U & FilterInput<T>>, value: U & FilterInput<T>, tag?: string): void {
    if (port === this.in.$ && value.incl) {
      this.out.$.send(value.val, tag);
    }
  }
}
