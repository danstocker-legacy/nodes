import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IMuxed} from "../../utils";
import {ISwitchInputs, TSwitchPositions} from "./Switch";

interface ISSwitchInputs<P extends string, V> {
  /** Multiple inputs, containing `d_val` and `st_pos`. */
  i: ISwitchInputs<P, V>;
}

interface ISSwitchOutputs<P extends string, V> {
  d_mux: IMuxed<TSwitchPositions<P, V>>;
}

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TODO: Add image URL.
 * @example
 * let switch: SSwitch<"d_foo" | "d_bar" | "d_baz", number>;
 * switch = new SSwitch(["d_foo", "d_bar", "d_baz");
 */
export class SSwitch<P extends string, V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISSwitchInputs<P, V>>;
  public readonly o: TOutBundle<ISSwitchOutputs<P, V>>;
  public readonly b: TOutBundle<ISSwitchInputs<P, V>>;

  private readonly positions: Set<P>;

  /**
   * @param positions Possible positions the switch may take. Must be
   * prefixed with each positions's respective domain. ("d_" / "st_" /
   * "ev_": data, state, event, etc.)
   */
  constructor(positions: Array<P>) {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, ["d_mux"]);
    MBouncer.init.call(this, ["i"]);
    this.positions = new Set(positions);
  }

  public send(
    port: IInPort<ISwitchInputs<P, V>>,
    value: ISwitchInputs<P, V>,
    tag?: string
  ): void {
    if (port === this.i.i) {
      const mul = value as ISwitchInputs<P, V>;
      const position = mul.st_pos;
      if (this.positions.has(position)) {
        this.o.d_mux.send({
          port: position,
          val: mul.d_val
        }, tag);
      } else {
        this.b.i.send(mul, tag);
      }
    }
  }
}
