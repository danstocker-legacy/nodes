import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface ISwitchInput<C extends string, V> {
  d_val: V;
  st_pos: C;
}

interface ISwitchInputs<C extends string, V> {
  sync: ISwitchInput<C, V>;
}

type TSwitchOutputs<C extends string, V> = {
  [K in C]: V
};

interface ISwitchBounced<C extends string, V> {
  b_sync: ISwitchInput<C, V>;
}

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
export class Switch<C extends string, V> implements ISink, ISource {
  public readonly i: TInBundle<ISwitchInputs<C, V>>;
  public readonly o: TOutBundle<TSwitchOutputs<C, V> & ISwitchBounced<C, V>>;

  /**
   * @param positions Strings identifying possible cases for switch.
   */
  constructor(positions: Array<string>) {
    MSink.init.call(this, ["sync"]);
    MSource.init.call(this, ["b_sync"].concat(positions));
  }

  public send(
    port: IInPort<ISwitchInput<C, V>>,
    value: ISwitchInput<C, V>,
    tag?: string
  ): void {
    if (port === this.i.sync) {
      const name = value.st_pos;
      const outPort = this.o[name];
      if (outPort) {
        outPort.send(value.d_val as any, tag);
      } else {
        this.o.b_sync.send(value as any, tag);
      }
    }
  }
}
