import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IBufferInput<V> {
  /** Value to be buffered. */
  d_val: V;

  /**
   * "Open" state of buffer.
   * When buffer is open, it releases contents then forwards input. When
   * buffer is closed, it buffers inputs in the order they arrive.
   */
  st_open: boolean;
}

interface IBufferInputs<V> {
  mul: IBufferInput<V>;
}

interface IBufferOutputs<V> {
  /** Value forwarded or released from buffer. */
  d_val: V;

  /** Whether buffer output is open. */
  st_open: boolean;

  /** Buffer size. */
  st_size: number;
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
  public readonly i: TInBundle<IBufferInputs<V> & IBufferInput<V>>;
  public readonly o: TOutBundle<IBufferOutputs<V>>;

  private readonly buffer: Array<[V, string]>;
  private open: boolean;

  constructor() {
    MSink.init.call(this, ["mul", "d_val", "st_open"]);
    MSource.init.call(this, ["d_val", "st_open", "st_size"]);
    this.buffer = [];
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IBufferInputs<V> & IBufferInput<V>>>,
    value: ValueOf<IBufferInputs<V> & IBufferInput<V>>,
    tag?: string
  ): void {
    const i = this.i;
    let openBefore: boolean;
    let openAfter: boolean;
    switch (port) {
      case i.mul:
        const mul = value as IBufferInput<V>;
        openBefore = this.open;
        openAfter = mul.st_open;
        this.open = openAfter;
        if (openAfter) {
          if (!openBefore) {
            this.releaseBuffer(tag);
          }
          this.o.d_val.send(value as V, tag);
        } else {
          this.addToBuffer(mul.d_val, tag);
        }
        break;

      case i.d_val:
        if (this.open) {
          this.o.d_val.send(value as V, tag);
        } else {
          this.addToBuffer(value as V, tag);
        }
        break;

      case i.st_open:
        openBefore = this.open;
        openAfter = value as boolean;
        this.open = openAfter;
        this.o.st_open.send(openAfter, tag);
        // if new value is true, release buffer contents
        if (openAfter && !openBefore) {
          this.releaseBuffer(tag);
        }
        break;
    }
  }

  /**
   * Adds specified value to buffer. Called when buffer is closed.
   * @param value
   * @param tag
   */
  private addToBuffer(value: V, tag?: string): void {
    const buffer = this.buffer;
    buffer.push([value, tag]);
    this.o.st_size.send(buffer.length, tag);
  }

  /**
   * Releases buffer contents to output. Called when buffer just opened.
   * @param tag
   */
  private releaseBuffer(tag?: string): void {
    const buffer = this.buffer;
    const d_val = this.o.d_val;
    while (buffer.length) {
      const next = buffer.shift();
      d_val.send(next[0], next[1]);
    }
    this.o.st_size.send(buffer.length, tag);
  }
}
