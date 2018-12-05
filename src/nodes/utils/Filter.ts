import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TFilterCallback<V> = (value: V, tag?: string) => boolean;

interface IFilterInputs<V> {
  $: V;
}

interface IFilterOutputs<V> {
  $: V;
  error: string;
}

/**
 * Forwards input that satisfies the specified tester callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * $ -> $:Mapper:$[$,include] -> $[$,include]:Picker:$[$,include] ->
 *   $[$,include]:Mapper:$ -> $
 * @example
 * const filter = new Filter<number>((a) => a%2);
 * filter.in.$.send(1); // outputs 1
 * filter.in.$.send(2); // will not output
 */
export class Filter<V> implements ISink, ISource, IBouncer {
  public readonly in: TInBundle<IFilterInputs<V>>;
  public readonly out: TOutBundle<IFilterOutputs<V>>;
  public readonly bounced: TOutBundle<IFilterInputs<V>>;

  private readonly cb: TFilterCallback<V>;

  constructor(cb: TFilterCallback<V>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$", "error"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      try {
        const include = this.cb(value, tag);
        if (include) {
          this.out.$.send(value, tag);
        }
      } catch (err) {
        this.bounced.$.send(value, tag);
        this.out.error.send(String(err), tag);
      }
    }
  }
}
