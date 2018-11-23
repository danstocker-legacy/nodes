import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

interface ISwitchInputs<P extends string, T> {
  val: T;
  case: P;
}

type TSwitchOutputs<P extends string, T> = {
  [K in P]: T
};

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * $ -----#=> Joiner -> Mapper -> Demuxer -+-> A
 * case --/                                +-> B
 *                                         +-> C
 *                                         ...
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, T>
  implements ISink, ISource {
  public readonly in: TInPorts<{
    $: ISwitchInputs<P, T>
  }>;
  public readonly out: TOutPorts<TSwitchOutputs<P, T>>;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, cases);
  }

  public send(
    port: IInPort<ISwitchInputs<P, T>>,
    value: ISwitchInputs<P, T>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      const name = value.case;
      const outPort = this.out[name];
      if (outPort) {
        outPort.send(value.val, tag);
      } else {
        // TODO: Bounce inputs
      }
    }
  }
}
