import {Demuxer, IMuxed, Mapper, Merger} from "../atomic";
import {INode} from "../node";
import {TInPorts, TOutPorts} from "../port";

interface ISwitchInputs<P extends string, T> {
  $: T;
  case: P;
}

type TSwitchOutputs<P extends string, T> = {
  [K in P]: T
};

function switchToMuxed<P extends string, T>(inputs: ISwitchInputs<P, T>): IMuxed<TSwitchOutputs<P, T>> {
  return {
    name: inputs.case,
    val: inputs.$
  };
}

/**
 * Forwards input to one of the possible outputs.
 * TODO: Extend generic Node base class.
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, T> implements INode<ISwitchInputs<P, T>, TSwitchOutputs<P, T>> {
  public readonly in: TInPorts<ISwitchInputs<P, T>>;
  public readonly out: TOutPorts<TSwitchOutputs<P, T>>;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    const merger = new Merger<ISwitchInputs<P, T>>(["case", "$"]);
    const mapper = new Mapper<ISwitchInputs<P, T>, IMuxed<TSwitchOutputs<P, T>>>(switchToMuxed);
    const demuxer = new Demuxer<TSwitchOutputs<P, T>>(cases);
    merger.out.$.connect(mapper.in.$);
    mapper.out.$.connect(demuxer.in.$);
    this.in = merger.in;
    this.out = demuxer.out;
  }
}
