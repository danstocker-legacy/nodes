import {ISink, ISource, Node, Sink, Source} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

/**
 * Forwards input with the specified delay.
 */
export class Delayer<V> extends Node implements ISink, ISource {
  public readonly in: TInPorts<{
    $: V
  }>;
  public readonly out: TOutPorts<{
    $: V
  }>;

  private readonly ms: number;

  /**
   * @param ms Delay in milliseconds.
   */
  constructor(ms: number) {
    super();
    Sink.init.call(this);
    Source.init.call(this);
    this.ms = ms;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      setTimeout(() => this.out.$.send(value, tag), this.ms);
    }
  }
}
