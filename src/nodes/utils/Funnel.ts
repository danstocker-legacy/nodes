import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TFunnelInputs<C extends string, V> = {
  [K in C]: V
};

interface IFunnelOutputs<C extends string, V> {
  d_val: V;
  st_pos: C;
}

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * Atomic equivalent of a composite node.
 * Composite view:
 * A -+-> Muxer -> Mapper -> Splitter =#-> $
 * B -+                                +-> st_pos
 * C -+
 * ...
 * @example
 * let funnel: Funnel<"foo" | "bar" | "baz", number>;
 * funnel = new Funnel(["foo", "bar", "baz"]);
 */
export class Funnel<C extends string, V> implements ISink, ISource {
  public readonly i: TInBundle<TFunnelInputs<C, V>>;
  public readonly o: TOutBundle<IFunnelOutputs<C, V>>;

  constructor(cases: Array<string>) {
    MSink.init.call(this, cases);
    MSource.init.call(this, ["d_val", "st_pos"]);
  }

  public send(
    port: IInPort<V>,
    value: V,
    tag?: string
  ): void {
    this.o.st_pos.send(port.name as C, tag);
    this.o.d_val.send(value, tag);
  }
}
