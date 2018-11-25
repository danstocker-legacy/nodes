import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TFunnelInputs<P extends string, T> = {
  [K in P]: T
};

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * Atomic equivalent of a composite node.
 * Composite view:
 * A -+-> Muxer -> Mapper -> Splitter =#-> $
 * B -+                                +-> case
 * C -+
 * ...
 * @example
 * let funnel: Funnel<"foo" | "bar" | "baz", number>;
 * funnel = new Funnel(["foo", "bar", "baz"]);
 */
export class Funnel<P extends string, T> implements ISink, ISource {
  public readonly in: TInBundle<TFunnelInputs<P, T>>;
  public readonly out: TOutBundle<{
    val: T;
    case: P;
  }>;

  constructor(cases: Array<string>) {
    MSink.init.call(this, cases);
    MSource.init.call(this, ["val", "case"]);
  }

  public send(
    port: IInPort<TFunnelInputs<P, T>>,
    value: T,
    tag?: string
  ): void {
    this.out.case.send(port.name as P, tag);
    this.out.val.send(value, tag);
  }
}
