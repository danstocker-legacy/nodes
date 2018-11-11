import {AtomicNode} from "../node";
import {IInPort, InPort, OutPort} from "../port";

interface IFilterInput<T> {
  val: T;
  incl: boolean;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<T> extends AtomicNode<{
  $: IFilterInput<T>;
}, {
  $: T;
}> {
  constructor() {
    super();
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<IFilterInput<T>>, input: IFilterInput<T>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
