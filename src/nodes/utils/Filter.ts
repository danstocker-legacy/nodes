import {
  IBouncer,
  IEvented,
  ISink,
  ISource,
  MBouncer, MEvented,
  MSink,
  MSource
} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

export type TFilterCallback<V> = (value: V, tag?: string) => boolean;

interface IFilterInputs<V> {
  $: V;
}

interface IFilterOutputs<V> {
  $: V;
}

interface IFilterEvents {
  err: string;
}

/**
 * Forwards input that satisfies the specified tester callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * $ -> $:Mapper:$[$,fwd] -> $[$,fwd]:Picker:$[$,fwd] -> $[$,fwd]:Mapper:$ -> $
 * @example
 * const filter = new Filter<number>((a) => a%2);
 * filter.i.$.send(1); // outputs 1
 * filter.i.$.send(2); // will not output
 */
export class Filter<V> implements ISink, ISource, IBouncer, IEvented {
  public readonly i: TInBundle<IFilterInputs<V>>;
  public readonly o: TOutBundle<IFilterOutputs<V>>;
  public readonly re: TOutBundle<IFilterInputs<V>>;
  public readonly e: TOutBundle<IFilterEvents>;

  private readonly cb: TFilterCallback<V>;

  constructor(cb: TFilterCallback<V>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    MEvented.init.call(this, ["err"]);
    this.cb = cb;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.i.$) {
      try {
        const include = this.cb(value, tag);
        if (include) {
          this.o.$.send(value, tag);
        }
      } catch (err) {
        this.re.$.send(value, tag);
        this.e.err.send(String(err), tag);
      }
    }
  }
}
