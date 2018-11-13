import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

interface ISerializerInputs<V> {
  $: V;
  tag: string;
}

interface ISerializerOutputs<V> {
  $: V;
}

/**
 * Forwards inputs matching the order of the reference input `tag`.
 * @example
 * let node: Serializer<number>;
 * node = new Serializer();
 */
export class Serializer<V> implements ISink<ISerializerInputs<V>>, ISource<ISerializerOutputs<V>> {
  public readonly in: TInPorts<ISerializerInputs<V>>;
  public readonly out: TOutPorts<ISerializerOutputs<V>>;

  private readonly inputs: Map<string, V>;
  private readonly order: Array<string>;

  constructor() {
    this.inputs = new Map();
    this.order = [];
    this.in = {
      $: new InPort("$", this),
      tag: new InPort("tag", this)
    };
    this.out = {
      $: new OutPort("$", this)
    };
  }

  public send(port: IInPort<V | string>, input: V | string, tag?: string): void {
    const ports = this.in;
    switch (port) {
      case ports.tag:
        this.order.push(tag);
        this.release();
        break;

      case ports.$:
        this.inputs.set(tag, <V> input);
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
