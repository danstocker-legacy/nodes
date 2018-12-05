import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface ISwitchInput<C extends string, T> {
  $: T;
  case: C;
}

interface ISwitchInputs<C extends string, T> {
  $: ISwitchInput<C, T>;
}

type TSwitchOutputs<C extends string, T> = {
  [K in C]: T
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
export class Switch<C extends string, T> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISwitchInputs<C, T>>;
  public readonly o: TOutBundle<TSwitchOutputs<C, T>>;
  public readonly re: TOutBundle<ISwitchInputs<C, T>>;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, cases);
    MBouncer.init.call(this, ["$"]);
  }

  public send(
    port: IInPort<ISwitchInput<C, T>>,
    value: ISwitchInput<C, T>,
    tag?: string
  ): void {
    if (port === this.i.$) {
      const name = value.case;
      const outPort = this.o[name];
      if (outPort) {
        outPort.send(value.$, tag);
      } else {
        this.re.$.send(value, tag);
      }
    }
  }
}
