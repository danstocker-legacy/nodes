import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

interface ISerializerInputs<V> {
  d_val: V;

  /** Reference input, defining tag order. */
  d_tag: string;
}

interface ISerializerOutputs<V> {
  d_val: V;
}

/**
 * Forwards inputs matching the order of the reference input `d_tag`.
 * @example
 * let node: Serializer<number>;
 * node = new Serializer();
 */
export class Serializer<V> implements ISink, ISource {
  public readonly i: TInBundle<ISerializerInputs<V>>;
  public readonly o: TOutBundle<ISerializerOutputs<V>>;

  private readonly inputs: Map<string, V>;
  private readonly order: Array<string>;

  constructor() {
    MSink.init.call(this, ["d_val", "d_tag"]);
    MSource.init.call(this, ["d_val"]);
    this.inputs = new Map();
    this.order = [];
  }

  public send(port: IInPort<V | string>, input: V | string, tag?: string): void {
    const ports = this.i;
    switch (port) {
      case ports.d_tag:
        this.order.push(tag);
        this.release();
        break;

      case ports.d_val:
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
    const $ = this.o.d_val;
    while (inputs.has(order[0])) {
      const nextTag = order.shift();
      const nextInput = inputs.get(nextTag);
      inputs.delete(nextTag);
      $.send(nextInput, nextTag);
    }
  }
}
