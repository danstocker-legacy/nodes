import {IAtomicSink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

export interface IInputs {
  /** Signal to be debounced. */
  ev_sig: any;
}

export interface IOutputs {
  /** Debounced signal. */
  ev_sig: any;
}

/**
 * Emits a signal a certain amount of time after receiving the last input.
 * Commonly used in conjunction with `Gate` and `Folder`.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * TODO: Add symmetric version.
 * @example
 * const debouncer = new Debouncer(500);
 * debouncer.i.ev_sig.connect(...);
 * debouncer.o.ev_sig.connect(...);
 */
export class Debouncer<V> implements IAtomicSink, ISource {
  public readonly i: TInBundle<IInputs>;
  public readonly o: TOutBundle<IOutputs>;

  private readonly ms: number;
  private timer: NodeJS.Timer;

  /**
   * @param ms Debounce delay in milliseconds.
   */
  constructor(ms: number) {
    MSink.init.call(this, ["ev_sig"]);
    MSource.init.call(this, ["ev_sig"]);
    this.ms = ms;
  }

  public send(port: IInPort<V>, value: V, tag: string): void {
    if (port === this.i.ev_sig) {
      const timer = this.timer;
      if (timer) {
        // interrupting timer & sending out last tag in buffer w/ false
        clearTimeout(timer);
      }

      this.timer = setTimeout(() => {
        this.o.ev_sig.send(null, tag);
      }, this.ms);
    }
  }
}
