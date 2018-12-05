import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IDebouncerInputs {
  $: any;
}

interface IDebouncerOutputs {
  $: boolean;
}

/**
 * Emits a boolean with the last received input tag: `true` when the specified
 * delay has passed since last received input tag, `false` when a new input is
 * received before timer runs out.
 * Atomic equivalent of a composite node.
 * Commonly used in conjunction with Picker and Folder.
 * Composite view:
 * TBD
 * @example
 * const debouncer = new Debouncer(500);
 * debouncer.i.$.connect(...);
 * debouncer.o.$.connect(...);
 */
export class Debouncer implements ISink, ISource {
  public readonly i: TInBundle<IDebouncerInputs>;
  public readonly o: TOutBundle<IDebouncerOutputs>;

  private readonly ms: number;
  private readonly buffer: Array<string>;
  private timer: NodeJS.Timer;

  /**
   * @param ms Debounce delay in milliseconds.
   */
  constructor(ms: number) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.ms = ms;
    this.buffer = [];
  }

  public send(port: IInPort<any>, value: any, tag: string): void {
    if (port === this.i.$) {
      const timer = this.timer;
      const buffer = this.buffer;
      buffer.push(tag);

      if (timer) {
        // interrupting timer & sending out last tag in buffer w/ false
        clearTimeout(timer);
        const next = buffer.shift();
        this.o.$.send(false, next);
      }

      this.timer = setTimeout(() => {
        this.o.$.send(true, tag);
      }, this.ms);
    }
  }
}
