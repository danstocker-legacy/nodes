import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../../node";
import {IInPort, TInBundle, TOutBundle} from "../../../port";

export type TSwitchPositions<P extends string, V> = {
  [branch in P]: V
};

export interface ISwitchInputs<P extends string, V> {
  /** Value to be sent to one of the outputs. */
  d_val: V;

  /** Switch position. Takes immediately. */
  st_pos: P;
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
export class Switch<P extends string, V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<ISwitchInputs<P, V>>;
  public readonly o: TOutBundle<TSwitchPositions<P, V>>;
  public readonly b: TOutBundle<Pick<ISwitchInputs<P, V>, "st_pos">>;

  private readonly positions: Set<P>;

  /**
   * Current position of the switch.
   * Input sent to `i.d_val` or `i` will be emitted through the output
   * port matching this as its name.
   */
  private position: P;

  /**
   * @param positions Possible positions the switch may take. Must be
   * prefixed with each positions's respective domain. ("d_" / "st_" /
   * "ev_": data, state, event, etc.)
   */
  constructor(positions: Array<P>) {
    MSink.init.call(this, ["d_val", "st_pos"]);
    MSource.init.call(this, positions);
    MBouncer.init.call(this, ["st_pos"]);
    this.positions = new Set(positions);
  }

  public send(
    port: IInPort<ISwitchInputs<P, V> | V | P>,
    value: ISwitchInputs<P, V> | V | P,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.st_pos:
        const position = value as P;
        if (this.positions.has(position)) {
          this.position = value as P;
        } else {
          this.b.st_pos.send(position, tag);
        }
        break;

      case i.d_val:
        const val = value as V;
        this.o[this.position].send(val, tag);
    }
  }
}
