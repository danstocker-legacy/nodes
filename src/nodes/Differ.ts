import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {TEqualityCallback} from "./UComparer";

interface IDifferInputs<V> {
  /** Value to be diffed. */
  d_val: V;
}

interface IDifferOutputs<V> {
  /** Non-equality of subsequent inputs. */
  d_diff: boolean;

  /** Error message. */
  ev_err: string;
}

/**
 * Compares each input with the previous and outputs whether they are
 * different, according to the specified equality callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const differ = new Differ<number>((a, b) => a === b);
 * differ.i.d_val.send(5) // emits `undefined` (first input)
 * differ.i.d_val.send(5) // emits `false` (not different)
 * differ.i.d_val.send(4) // emits `true` (is different)
 */
export class Differ<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IDifferInputs<V>>;
  public readonly o: TOutBundle<IDifferOutputs<V>>;
  public readonly b: TOutBundle<IDifferInputs<V>>;

  private readonly cb: TEqualityCallback<V>;
  private buffer: Array<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_diff", "ev_err"]);
    MBouncer.init.call(this, ["d_val"]);
    this.cb = cb;
    this.buffer = [];
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.d_val) {
      const buffer = this.buffer;
      buffer.push(value);
      if (buffer.length > 1) {
        try {
          const equals = this.cb(buffer.shift(), value);
          this.o.d_diff.send(!equals, tag);
        } catch (err) {
          this.b.d_val.send(value, tag);
          this.o.ev_err.send(String(err), tag);
        }
      } else {
        this.buffer = buffer;
        this.o.d_diff.send(undefined, tag);
      }
    }
  }
}
