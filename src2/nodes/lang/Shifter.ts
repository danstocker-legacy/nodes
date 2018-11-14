import {ISink, ISource, Node, Sink, Source} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

/**
 * Forwards previous input.
 * Does not know about original tag order. Feed through Serializer if
 * original tag order is to be retained.
 */
export class Shifter<V> extends Node implements ISink, ISource {
  public readonly in: TInPorts<{
    $: V;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;

  private readonly disp: number;
  private readonly buffer: Array<V>;

  /**
   * @param disp Displacement
   */
  constructor(disp: number = 1) {
    super();
    Sink.init.call(this);
    Source.init.call(this);
    this.disp = disp;
    this.buffer = [];
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    const disp = this.disp;
    const buffer = this.buffer;
    buffer.push(input);
    if (buffer.length > disp) {
      this.out.$.send(buffer.shift(), tag);
    } else {
      this.out.$.send(undefined, tag);
    }
  }
}
