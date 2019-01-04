import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";
import {ValueOf} from "../utils";

export interface IInputs<V> {
  /** Value to be forwarded. */
  d_val: V;

  /** Whether gate should be open. */
  st_open: boolean;
}

export interface IOutputs<V> {
  /** Forwarded value. */
  d_val: V;
}

/**
 * Forwards input value when gate is open. Bounces input when gate is closed.
 * @example
 * const gate = new Gate<number>();
 * gate.i.st_open.send(true);   // opening gate
 * gate.i.d_val.send(5, "1");   // emits 5 on `o.d_val`
 * gate.i.st_open.send(false);  // closing gate
 * gate.i.d_val.send(5, "1");   // doesn't emit
 */
export class Gate<V> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;

  private open: boolean;

  constructor() {
    MSink.init.call(this, ["d_val", "st_open"]);
    MSource.init.call(this, ["d_val"]);
    this.open = false;
  }

  public send(
    port: IInPort<ValueOf<IInputs<V>>>,
    value: ValueOf<IInputs<V>>,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.st_open:
        const open = value as boolean;
        this.open = open;
        break;

      case i.d_val:
        const val = value as V;
        if (this.open) {
          this.o.d_val.send(val, tag);
        }
        break;
    }
  }
}
