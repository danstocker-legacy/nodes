import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {TEqualityCallback} from "./Comparer";

interface IDifferInputs<V> {
  $: V;
}

interface IDifferOutputs {
  $: boolean;
}

interface IDifferEvents {
  err: string;
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
export class Differ<V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IDifferInputs<V>>;
  public readonly o: TOutBundle<IDifferOutputs & IDifferEvents>;
  public readonly re: TOutBundle<IDifferInputs<V>>;

  private readonly cb: TEqualityCallback<V>;
  private buffer: Array<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$", "err"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
    this.buffer = [];
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.$) {
      const buffer = this.buffer;
      buffer.push(value);
      if (buffer.length > 1) {
        try {
          const equals = this.cb(buffer.shift(), value);
          this.o.$.send(!equals, tag);
        } catch (err) {
          this.re.$.send(value, tag);
          this.o.err.send(String(err), tag);
        }
      } else {
        this.buffer = buffer;
        this.o.$.send(undefined, tag);
      }
    }
  }
}
