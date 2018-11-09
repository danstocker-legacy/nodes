import {AtomicNode} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";

/**
 * Forwards inputs matching the order of the reference input `tag`.
 * @example
 * let node: Serializer<number>;
 * node = new Serializer();
 */
export class Serializer<T> extends AtomicNode {
  public readonly in: TInPorts<{
    $: T,
    tag: string
  }>;
  public readonly out: TOutPorts<{
    $: T
  }>;

  private readonly inputs: Map<string, T>;
  private readonly order: Array<string>;

  constructor() {
    super();
    this.inputs = new Map();
    this.order = [];
    this.in.$ = new InPort("$", this);
    this.in.tag = new InPort("tag", this);
    this.out.$ = new OutPort("$", this);
  }

  public send<U>(port: IInPort<U & (T | string)>, input: U & (T | string), tag?: string): void {
    const ports = this.in;
    switch (port) {
      case ports.tag:
        this.order.push(tag);
        this.release();
        break;

      case ports.$:
        this.inputs.set(tag, <T> input);
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
