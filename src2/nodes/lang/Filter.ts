import {ISink, ISource, Node, Sink, Source} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

interface IFilterInput<V> {
  val: V;
  incl: boolean;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<V> extends Node implements ISink, ISource {
  public readonly in: TInPorts<{
    $: IFilterInput<V>;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;

  constructor() {
    super();
    Sink.init.call(this);
    Source.init.call(this);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<IFilterInput<V>>, input: IFilterInput<V>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
