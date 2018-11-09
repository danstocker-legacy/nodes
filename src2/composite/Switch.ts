import {Demuxer, Mapper, Merger, TMuxed} from "../atomic";
import {INode} from "../node";
import {TInPorts, TOutPorts} from "../port";

type TSwitchInputs<P extends string, T> = {
  $: T,
  case: P
};

type TSwitchOutputs<P extends string, T> = {
  [K in P]: T
};

function switchToMuxed<P extends string, T>(inputs: TSwitchInputs<P, T>): TMuxed<TSwitchOutputs<P, T>> {
  return {
    name: inputs.case,
    value: inputs.$
  };
}

/**
 * Forwards input to one of the possible outputs.
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, T> implements INode {
  public readonly in: TInPorts<TSwitchInputs<P, T>>;
  public readonly out: TOutPorts<TSwitchOutputs<P, T>>;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    const merger = new Merger<TSwitchInputs<P, T>>(["case", "$"]);
    const mapper = new Mapper<TSwitchInputs<P, T>, TMuxed<TSwitchOutputs<P, T>>>(switchToMuxed);
    const demuxer = new Demuxer<TSwitchOutputs<P, T>>(cases);
    merger.out.$.connect(mapper.in.$);
    mapper.out.$.connect(demuxer.in.$);
    this.in = merger.in;
    this.out = demuxer.out;
  }
}
