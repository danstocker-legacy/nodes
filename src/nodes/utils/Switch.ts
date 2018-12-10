import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, IOutPort, TInBundle, TOutBundle} from "../../port";

interface ISwitchInput<P extends string, V> {
  d_val: V;
  st_pos: P;
}

interface ISwitchInputs<P extends string, V> {
  sync: ISwitchInput<P, V>;
}

type TSwitchOutputs<P extends string, V> = {
  [K in P]: V
};

interface ISwitchBounced<P extends string, V> {
  b_sync: ISwitchInput<P, V>;
  b_d_val: V;
}

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * d_val ---#=> Joiner -> Mapper -> Demuxer -+-> A
 * st_pos --/                                +-> B
 *                                           +-> P
 *                                           ...
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, V> implements ISink, ISource {
  public readonly i: TInBundle<ISwitchInputs<P, V> & ISwitchInput<P, V>>;
  public readonly o: TOutBundle<TSwitchOutputs<P, V> & ISwitchBounced<P, V>>;

  /**
   * Current position of the switch.
   * Input sent to `i.d_val` or `sync` will be emitted through the output
   * port matching this as its name.
   */
  private position: P;

  /**
   * @param positions Strings identifying possible cases for switch.
   */
  constructor(positions: Array<string>) {
    MSink.init.call(this, ["sync", "d_val", "st_pos"]);
    MSource.init.call(this, ["b_sync"].concat(positions));
  }

  public send(
    port: IInPort<ISwitchInput<P, V> | V | P>,
    value: ISwitchInput<P, V> | V | P,
    tag?: string
  ): void {
    const inPorts = this.i;
    let outPort: IOutPort<any>;
    switch (port) {
      case inPorts.sync:
        const synced = value as ISwitchInput<P, V>;
        const position = synced.st_pos;
        this.position = position;

        outPort = this.o[position];
        if (outPort) {
          outPort.send(synced.d_val, tag);
        } else {
          this.o.b_sync.send(synced as any, tag);
        }
        break;

      case inPorts.st_pos:
        this.position = value as P;
        break;

      case inPorts.d_val:
        const data = value as V;
        outPort = this.o[this.position];
        if (outPort) {
          outPort.send(data, tag);
        } else {
          this.o.b_d_val.send(data, tag);
        }
    }
  }
}
