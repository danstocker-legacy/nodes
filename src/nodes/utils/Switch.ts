import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, IOutPort, TInBundle, TOutBundle} from "../../port";

interface ISwitchInput<P extends string, V> {
  /** Value to be sent to one of the outputs. */
  d_val: V;

  /** Switch position. Takes immediately. */
  st_pos: P;
}

interface ISwitchInputs<P extends string, V> {
  /** Multiple inputs, containing `d_val` and `st_pos`. */
  mul: ISwitchInput<P, V>;
}

type TSwitchOutputs<P extends string, V> = {
  [K in P]: V
};

interface ISwitchBounced<P extends string, V> {
  /** Bounced multiple inputs */
  b_mul: ISwitchInput<P, V>;

  /** Bounced input value */
  b_d_val: V;
}

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * d_val ---#=> d_#:Joiner:d_mul -> d_val:Mapper:d_val -> d_mux:Demuxer:d_val -+-> A
 * st_pos --/                                                                  +-> B
 *                                                                             +-> P
 *                                                                             ...
 * @example
 * let switch: Switch<"d_foo" | "d_bar" | "d_baz", number>;
 * switch = new Switch(["d_foo", "d_bar", "d_baz");
 */
export class Switch<P extends string, V> implements ISink, ISource {
  public readonly i: TInBundle<ISwitchInputs<P, V> & ISwitchInput<P, V>>;
  public readonly o: TOutBundle<TSwitchOutputs<P, V> & ISwitchBounced<P, V>>;

  /**
   * Current position of the switch.
   * Input sent to `i.d_val` or `mul` will be emitted through the output
   * port matching this as its name.
   */
  private position: P;

  /**
   * @param positions Possible positions the switch may take. Must be
   * prefixed with each positions's respective domain. ("d_" / "st_" /
   * "ev_": data, state, event, etc.)
   */
  constructor(positions: Array<string>) {
    MSink.init.call(this, ["mul", "d_val", "st_pos"]);
    MSource.init.call(this, ["b_mul"].concat(positions));
  }

  public send(
    port: IInPort<ISwitchInput<P, V> | V | P>,
    value: ISwitchInput<P, V> | V | P,
    tag?: string
  ): void {
    const i = this.i;
    let outPort: IOutPort<any>;
    switch (port) {
      case i.mul:
        const synced = value as ISwitchInput<P, V>;
        const position = synced.st_pos;
        this.position = position;

        outPort = this.o[position];
        if (outPort) {
          outPort.send(synced.d_val, tag);
        } else {
          this.o.b_mul.send(synced as any, tag);
        }
        break;

      case i.st_pos:
        this.position = value as P;
        break;

      case i.d_val:
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
