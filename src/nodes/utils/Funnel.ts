import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TFunnelInputs<P extends string, V> = {
  [K in P]: V
};

interface IFunnelOutputs<P extends string, V> {
  /** Captured value. */
  d_val: V;

  /** Affected position. */
  st_pos: P;
}

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * Atomic equivalent of a composite node.
 * Composite view:
 * d_A -+-> d_val:Muxer:d_mux -> d_val:Mapper:d_val -> d_mul:Splitter:d_val =#-> d_val
 * d_B -+                                                                    +-> st_pos
 * d_C -/
 * ...
 * @example
 * let funnel: Funnel<"d_foo" | "d_bar" | "d_baz", number>;
 * funnel = new Funnel(["d_foo", "d_bar", "d_baz"]);
 */
export class Funnel<P extends string, V> implements ISink, ISource {
  public readonly i: TInBundle<TFunnelInputs<P, V>>;
  public readonly o: TOutBundle<IFunnelOutputs<P, V>>;

  /**
   * @param positions Possible positions the funnel expects input from. Must
   * be prefixed with each positions's respective domain. ("d_" / "st_" /
   * "ev_": data, state, event, etc.)
   */
  constructor(positions: Array<string>) {
    MSink.init.call(this, positions);
    MSource.init.call(this, ["d_val", "st_pos"]);
  }

  public send(
    port: IInPort<V>,
    value: V,
    tag?: string
  ): void {
    this.o.st_pos.send(port.name as P, tag);
    this.o.d_val.send(value, tag);
  }
}
