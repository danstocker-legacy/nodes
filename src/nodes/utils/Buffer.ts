import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IBufferInputs<V> {
  /** Value to be buffered. */
  d_val: V;

  /**
   * "Open" state of buffer.
   * When buffer is open, it releases contents then forwards input. When
   * buffer is closed, it buffers inputs in the order they arrive.
   */
  st_open: boolean;
}

interface IBufferOutputs<V> {
  /** Value forwarded or released from buffer. */
  d_val: V;

  /** Buffer size. */
  st_size: number;
}

/**
 * Buffers inputs when open. Forwards input otherwise.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * TODO: Add multiple inputs port.
 * @example
 * TBD
 */
export class Buffer<V> implements ISink, ISource {
  public readonly i: TInBundle<IBufferInputs<V>>;
  public readonly o: TOutBundle<IBufferOutputs<V>>;

  private readonly buffer: Array<[V, string]>;
  private open: boolean;

  constructor() {
    MSink.init.call(this, ["d_val", "st_open"]);
    MSource.init.call(this, ["d_val", "st_size"]);
    this.buffer = [];
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IBufferInputs<V>>>,
    value: ValueOf<IBufferInputs<V>>,
    tag?: string
  ): void {
    switch (port) {
      case this.i.d_val:
        if (this.open) {
          this.o.d_val.send(value as V, tag);
        } else {
          const buffer = this.buffer;
          buffer.push([value as V, tag]);
          this.o.st_size.send(buffer.length);
        }
        break;

      case this.i.st_open:
        const openBefore = this.open;
        const openAfter = value as boolean;
        // if new value is true, release buffer contents
        if (openAfter && !openBefore) {
          this.open = openAfter;
          const buffer = this.buffer;
          const d_val = this.o.d_val;
          while (buffer.length) {
            const next = buffer.shift();
            d_val.send(next[0], next[1]);
          }
          this.o.st_size.send(buffer.length);
        }
        break;
    }
  }
}
