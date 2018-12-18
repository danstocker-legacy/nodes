import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IMuxed} from "../../utils";

type TSwitchPositions<P extends string, V> = {
  [branch in P]: V
};

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

interface ISwitchOutputs<P extends string, V> {
  d_mux: IMuxed<TSwitchPositions<P, V>>;

  /** Bounced multiple inputs */
  b_mul: ISwitchInput<P, V>;

  /** Bounced switch position. (When position is not available.) */
  b_st_pos: P;
}

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TODO: Add image URL.
 * @example
 * let switch: Switch<"d_foo" | "d_bar" | "d_baz", number>;
 * switch = new Switch(["d_foo", "d_bar", "d_baz");
 */
export class Switch<P extends string, V> implements ISink, ISource {
  public readonly i:
    TInBundle<ISwitchInputs<P, V>> &
    TInBundle<ISwitchInput<P, V>>;
  public readonly o: TOutBundle<ISwitchOutputs<P, V>>;

  private readonly positions: Set<P>;

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
  constructor(positions: Array<P>) {
    MSink.init.call(this, ["mul", "d_val", "st_pos"]);
    MSource.init.call(this, ["d_mux", "b_mul", "b_st_pos"]);
    this.positions = new Set(positions);
  }

  public send(
    port: IInPort<ISwitchInput<P, V> | V | P>,
    value: ISwitchInput<P, V> | V | P,
    tag?: string
  ): void {
    const i = this.i;
    const o = this.o;
    let position: P;
    switch (port) {
      case i.mul:
        const mul = value as ISwitchInput<P, V>;
        position = mul.st_pos;
        if (this.positions.has(position)) {
          this.position = position;
          o.d_mux.send({
            name: position,
            val: mul.d_val
          }, tag);
        } else {
          o.b_mul.send(mul, tag);
        }
        break;

      case i.st_pos:
        position = value as P;
        if (this.positions.has(position)) {
          this.position = value as P;
        } else {
          o.b_st_pos.send(position, tag);
        }
        break;

      case i.d_val:
        const val = value as V;
        o.d_mux.send({
          name: this.position,
          val
        }, tag);
    }
  }
}
