import {AtomicNode} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";

type FilterInput<T> = { val: T, incl: boolean };

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<T> extends AtomicNode {
  public readonly in: TInPorts<{
    $: FilterInput<T>
  }>;
  public readonly out: TOutPorts<{
    $: T
  }>;

  constructor() {
    super();
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send<U>(port: IInPort<U & FilterInput<T>>, input: U & FilterInput<T>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
