import {Demuxer, Mapper, Merger, TMuxed} from "../lang";
import {TStaticInPorts, TStaticOutPorts} from "../port";

type TSwitchInputs<P, T> = {
  case: P,
  $: T
};

type TSwitchOutputs<P extends string, T> = {
  [K in P]: T
};

/**
 * Forwards input to one of the possible outputs.
 * TODO: Implement INode or ISuperNode interface.
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, T> {
  public readonly in: TStaticInPorts<TSwitchInputs<P, T>>;
  public readonly out: TStaticOutPorts<TSwitchOutputs<P, T>>;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    const merger = new Merger<TSwitchInputs<P, T>>(["case", "$"]);
    const cb = (switchInputs: TSwitchInputs<P, T>): TMuxed<TSwitchOutputs<P, T>> => {
      return {
        name: switchInputs.case,
        value: switchInputs.$
      };
    };
    const mapper = new Mapper<TSwitchInputs<P, T>, TMuxed<TSwitchOutputs<P, T>>>(cb);
    const demuxer = new Demuxer<TSwitchOutputs<P, T>>(cases);
    merger.out.$.connect(mapper.in.$);
    mapper.out.$.connect(demuxer.in.$);
    this.in = merger.in;
    this.out = demuxer.out;
  }
}
