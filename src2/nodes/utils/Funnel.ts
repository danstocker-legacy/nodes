import {TInPorts, TOutPorts} from "../../port";
import {IMuxed} from "../../utils";
import {Mapper, Muxer, Splitter} from "../lang";

type TFunnelInputs<P extends string, T> = {
  [K in P]: T
};

interface IFunnelOutputs<P extends string, T> {
  $: T;
  case: P;
}

function muxedToSwitch<P extends string, T>(inputs: IMuxed<TFunnelInputs<P, T>>): IFunnelOutputs<P, T> {
  return {
    $: inputs.val,
    case: inputs.name
  };
}

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * Atomic implementation of a composite node.
 * Composite view:
 * A -+-> Muxer -> Mapper -> Splitter =#-> $
 * B -+                                +-> case
 * C -+
 * ...
 * @example
 * let funnel: Funnel<"foo" | "bar" | "baz", number>;
 * funnel = new Funnel(["foo", "bar", "baz"]);
 */
export class Funnel<P extends string, T> {
  public readonly in: TInPorts<TFunnelInputs<P, T>>;
  public readonly out: TOutPorts<IFunnelOutputs<P, T>>;

  constructor(cases: Array<string>) {
    const muxer = new Muxer<TFunnelInputs<P, T>>(cases);
    const mapper = new Mapper<IMuxed<TFunnelInputs<P, T>>, IFunnelOutputs<P, T>>(muxedToSwitch);
    const splitter = new Splitter<IFunnelOutputs<P, T>>(["case", "$"]);
    muxer.out.$.connect(mapper.in.$);
    mapper.out.$.connect(splitter.in.$);
    this.in = muxer.in;
    this.out = splitter.out;
  }
}
