import {
  IAtomicSink,
  IBouncer,
  ISource,
  MBouncer,
  MSink,
  MSource
} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {IInputs as ISwitchInputs, TSwitchPositions} from "./Switch";

export interface IInputs<P extends string, V> {
  /** Multiple inputs, containing `d_val` and `st_pos`. */
  i: ISwitchInputs<P, V>;
}

export type TOutputs<P extends string, V> = TSwitchPositions<P, V>;

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TODO: Add image URL.
 * @example
 * let switch: USwitch<"d_foo" | "d_bar" | "d_baz", number>;
 * switch = new USwitch(["d_foo", "d_bar", "d_baz");
 */
export class USwitch<P extends string, V> implements IAtomicSink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<P, V>>;
  public readonly o: TOutBundle<TOutputs<P, V>>;
  public readonly b: TOutBundle<IInputs<P, V>>;

  private readonly positions: Set<P>;

  /**
   * @param positions Possible positions the switch may take. Must be
   * prefixed with each positions's respective domain. ("d_" / "st_" /
   * "ev_": data, state, event, etc.)
   */
  constructor(positions: Array<P>) {
    MSink.init.call(this, ["i"]);
    MSource.init.call(this, positions);
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
        this.o[position].send(mul.d_val, tag);
      } else {
        this.b.i.send(mul, tag);
      }
    }
  }
}
