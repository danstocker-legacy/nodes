import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface ISwitchInput<C extends string, T> {
  d_val: T;
  st_pos: C;
}

interface ISwitchInputs<C extends string, T> {
  sync: ISwitchInput<C, T>;
}

type TSwitchOutputs<C extends string, T> = {
  [K in C]: T
};

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * d_val ---#=> Syncer -> Mapper -> Demuxer -+-> A
 * st_pos --/                                +-> B
 *                                           +-> C
 *                                           ...
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<C extends string, T> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISwitchInputs<C, T>>;
  public readonly o: TOutBundle<TSwitchOutputs<C, T>>;
  public readonly re: TOutBundle<ISwitchInputs<C, T>>;

  /**
   * @param positions Strings identifying possible cases for switch.
   */
  constructor(positions: Array<string>) {
    MSink.init.call(this, ["sync"]);
    MSource.init.call(this, positions);
    MBouncer.init.call(this, ["sync"]);
  }

  public send(
    port: IInPort<ISwitchInput<C, T>>,
    value: ISwitchInput<C, T>,
    tag?: string
  ): void {
    if (port === this.i.sync) {
      const name = value.st_pos;
      const outPort = this.o[name];
      if (outPort) {
        outPort.send(value.d_val, tag);
      } else {
        this.re.sync.send(value, tag);
      }
    }
  }
}
