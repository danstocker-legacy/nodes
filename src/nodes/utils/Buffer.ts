import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IBufferInputs<V> {
  $: V;
}

interface IBufferOutputs<V> {
  $: V;
}

interface IBufferStateIn {
  open: boolean;
}

interface IBufferStateOut {
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
  public readonly i: TInBundle<IBufferInputs<V> & IBufferStateIn>;
  public readonly o: TOutBundle<IBufferOutputs<V> & IBufferStateOut>;

  private readonly buffer: Array<[V, string]>;
  private open: boolean;

  constructor() {
    MSink.init.call(this, ["$", "open"]);
    MSource.init.call(this, ["$", "size"]);
    this.buffer = [];
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IBufferInputs<V>> | ValueOf<IBufferStateIn>>,
    value: ValueOf<IBufferInputs<V>> | ValueOf<IBufferStateIn>,
    tag?: string
  ): void {
    switch (port) {
      case this.i.$:
        if (this.open) {
          this.o.$.send(value as V, tag);
        } else {
          const buffer = this.buffer;
          buffer.push([value as V, tag]);
          this.o.size.send(buffer.length);
        }
        break;

      case this.i.open:
        const openBefore = this.open;
        const openAfter = value as boolean;
        // if new value is true, release buffer contents
        if (openAfter && !openBefore) {
          this.open = openAfter;
          const buffer = this.buffer;
          const $ = this.o.$;
          while (buffer.length) {
            const next = buffer.shift();
            $.send(next[0], next[1]);
          }
          this.o.size.send(buffer.length);
        }
        break;
    }
  }
}
