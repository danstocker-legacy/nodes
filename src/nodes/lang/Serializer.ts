import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

/**
 * Forwards inputs matching the order of the reference input `tag`.
 * @example
 * let node: Serializer<number>;
 * node = new Serializer();
 */
export class Serializer<V> implements ISink, ISource {
  public readonly in: TInPorts<{
    $: V;
    tag: string;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;

  private readonly inputs: Map<string, V>;
  private readonly order: Array<string>;

  constructor() {
    MSink.init.call(this, ["$", "tag"]);
    MSource.init.call(this, ["$"]);
    this.inputs = new Map();
    this.order = [];
  }

  public send(port: IInPort<V | string>, input: V | string, tag?: string): void {
    const ports = this.in;
    switch (port) {
      case ports.tag:
        this.order.push(tag);
        this.release();
        break;

      case ports.$:
        this.inputs.set(tag, input as V);
        this.release();
        break;
    }
  }

  /**
   * Releases cached inputs up to the first tag for which there is no input.
   */
  private release(): void {
    const inputs = this.inputs;
    const order = this.order;
    const $ = this.out.$;
    while (inputs.has(order[0])) {
      const nextTag = order.shift();
      const nextInput = inputs.get(nextTag);
      inputs.delete(nextTag);
      $.send(nextInput, nextTag);
    }
  }
}