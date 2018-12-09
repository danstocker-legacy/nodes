import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {TEqualityCallback} from "./Comparer";

interface IDifferInputs<V> {
  d_val: V;
}

interface IDifferOutputs<V> {
  b_d_val: V;
  d_diff: boolean;
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
 * differ.i.$.send(5) // outputs `undefined` (first input)
 * differ.i.$.send(5) // outputs `false` (not different)
 * differ.i.$.send(4) // outputs `true` (is different)
 */
export class Differ<V> implements ISink, ISource {
  public readonly i: TInBundle<IDifferInputs<V>>;
  public readonly o: TOutBundle<IDifferOutputs<V>>;

  private readonly cb: TEqualityCallback<V>;
  private buffer: Array<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["b_d_val", "d_diff", "ev_err"]);
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
          this.o.b_d_val.send(value, tag);
          this.o.ev_err.send(String(err), tag);
        }
      } else {
        this.buffer = buffer;
        this.o.d_diff.send(undefined, tag);
      }
    }
  }
}
