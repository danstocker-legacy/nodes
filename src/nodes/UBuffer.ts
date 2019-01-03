import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {IInputs, IOutputs} from "./Buffer";

/**
 * Buffers inputs when open. Forwards input otherwise.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * TODO: Share code w/ Buffer
 * @example
 * TBD
 */
export class UBuffer<V> implements ISink, ISource {
  public readonly i: TInBundle<{
    i: IInputs<V>;
  }>;
  public readonly o: TOutBundle<IOutputs<V>>;

  private readonly buffer: Array<[V, string]>;
  private open: boolean;

  constructor() {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_val", "st_size"]);
    this.buffer = [];
    this.open = false;
  }

  public send(
    port: IInPort<IInputs<V>>,
    value: IInputs<V>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      const openBefore = this.open;
      const openAfter = value.st_open;
      this.open = openAfter;
      if (openAfter) {
        if (!openBefore) {
          this.releaseBuffer(tag);
        }
        this.o.d_val.send(value.d_val, tag);
      } else {
        this.addToBuffer(value.d_val, tag);
      }
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
