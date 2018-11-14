import {ISink, ISource, Node, Sink, Source} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

interface INoopInputs<V> {
  $: V;
}

interface INoopOutputs<V> {
  $: V;
}

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.in.$.send(5);
 */
export class Noop<V> extends Node implements ISink, ISource {
  public readonly in: TInPorts<INoopInputs<V>>;
  public readonly out: TOutPorts<INoopOutputs<V>>;

  constructor() {
    super();
    Sink.init.call(this);
    Source.init.call(this);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(input, tag);
    }
  }
}
