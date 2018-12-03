import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IBufferInputs<V> {
  $: V;
  open: boolean;
}

interface IBufferOutputs<V> {
  $: V;
  size: number;
}

/**
 * Buffers inputs when open. Forwards input otherwise.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * TBD
 */
export class Buffer<V> implements ISink, ISource {
  public readonly in: TInBundle<IBufferInputs<V>>;
  public readonly out: TOutBundle<IBufferOutputs<V>>;

  private readonly buffer: Array<[V, string]>;
  private open: boolean;

  constructor() {
    MSink.init.call(this, ["$", "open"]);
    MSource.init.call(this, ["$", "size"]);
    this.buffer = [];
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IBufferInputs<V>>>,
    value: ValueOf<IBufferInputs<V>>,
    tag?: string
  ): void {
    const inPorts = this.in;
    const outPorts = this.out;
    switch (port) {
      case inPorts.$:
        if (this.open) {
          outPorts.$.send(value as V, tag);
        } else {
          const buffer = this.buffer;
          buffer.push([value as V, tag]);
          outPorts.size.send(buffer.length);
        }
        break;

      case inPorts.open:
        const openBefore = this.open;
        const openAfter = value as boolean;
        // if new value is true, release buffer contents
        if (openAfter && !openBefore) {
          this.open = openAfter;
          const buffer = this.buffer;
          const $ = outPorts.$;
          while (buffer.length) {
            const next = buffer.shift();
            $.send(next[0], next[1]);
          }
          outPorts.size.send(buffer.length);
        }
        break;
    }
  }
}
