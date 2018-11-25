import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {TEqualityCallback} from "./Comparer";

/**
 * Compares each input with the previous and outputs whether they are
 * different, according to the specified equality callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const differ = new Differ<number>((a, b) => a === b);
 * differ.in.$.send(5) // outputs `undefined` (first input)
 * differ.in.$.send(5) // outputs `false` (not different)
 * differ.in.$.send(4) // outputs `true` (is different)
 */
export class Differ<V> implements ISink, ISource {
  public readonly in: TInBundle<{
    $: V;
  }>;
  public readonly out: TOutBundle<{
    $: boolean;
  }>;

  private readonly cb: TEqualityCallback<V>;
  private buffer: Array<V>;

  constructor(cb: TEqualityCallback<V>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.cb = cb;
    this.buffer = [];
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      const buffer = this.buffer;
      buffer.push(value);
      if (buffer.length > 1) {
        const equals = this.cb(buffer.shift(), value);
        this.out.$.send(!equals, tag);
      } else {
        this.buffer = buffer;
        this.out.$.send(undefined, tag);
      }
    }
  }
}
