import {Mapper, Muxer, Splitter, TMuxed} from "../atomic";
import {INode} from "../node";
import {TInPorts, TOutPorts} from "../port";

type TFunnelInputs<P extends string, T> = {
  [K in P]: T
};

type TFunnelOutputs<P extends string, T> = {
  $: T,
  case: P
};

function muxedToSwitch<P extends string, T>(inputs: TMuxed<TFunnelInputs<P, T>>): TFunnelOutputs<P, T> {
  return {
    $: inputs.val,
    case: inputs.name
  };
}

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * @example
 * let funnel: Funnel<"foo" | "bar" | "baz", number>;
 * funnel = new Funnel(["foo", "bar", "baz"]);
 */
export class Funnel<P extends string, T> implements INode {
  public readonly in: TInPorts<TFunnelInputs<P, T>>;
  public readonly out: TOutPorts<TFunnelOutputs<P, T>>;

  constructor(cases: Array<string>) {
    const muxer = new Muxer<TFunnelInputs<P, T>>(cases);
    const mapper = new Mapper<TMuxed<TFunnelInputs<P, T>>, TFunnelOutputs<P, T>>(muxedToSwitch);
    const splitter = new Splitter<TFunnelOutputs<P, T>>(["case", "$"]);
    muxer.out.$.connect(mapper.in.$);
    mapper.out.$.connect(splitter.in.$);
    this.in = muxer.in;
    this.out = splitter.out;
  }
}
