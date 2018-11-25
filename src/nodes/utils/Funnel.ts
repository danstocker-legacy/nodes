import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TFunnelInputs<C extends string, T> = {
  [K in C]: T
};

interface IFunnelOutputs<C extends string, T> {
  $: T;
  case: C;
}

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
export class Funnel<C extends string, T> implements ISink, ISource {
  public readonly in: TInBundle<TFunnelInputs<C, T>>;
  public readonly out: TOutBundle<IFunnelOutputs<C, T>>;

  constructor(cases: Array<string>) {
    MSink.init.call(this, cases);
    MSource.init.call(this, ["$", "case"]);
  }

  public send(
    port: IInPort<TFunnelInputs<C, T>>,
    value: T,
    tag?: string
  ): void {
    this.out.case.send(port.name as C, tag);
    this.out.$.send(value, tag);
  }
}
