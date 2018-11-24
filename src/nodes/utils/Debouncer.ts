import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

/**
 * Emits a boolean with the last received input tag: `true` when the specified
 * delay has passed since last received input tag, `false` when a new input is
 * received before timer runs out.
 * Atomic equivalent of a composite node.
 * Commonly used in conjunction with Filter and Folder.
 * Composite view:
 * TBD
 * @example
 * const debouncer = new Debouncer(500);
 * debouncer.in.$.connect(...);
 * debouncer.out.$.connect(...);
 */
export class Debouncer implements ISink, ISource {
  public readonly in: TInPorts<{
    $: any
  }>;
  public readonly out: TOutPorts<{
    $: boolean
  }>;

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
    if (port === this.in.$) {
      const timer = this.timer;
      const buffer = this.buffer;
      buffer.push(tag);

      if (timer) {
        // interrupting timer & sending out last tag in buffer w/ false
        clearTimeout(timer);
        const next = buffer.shift();
        this.out.$.send(false, next);
      }

      this.timer = setTimeout(() => {
        this.out.$.send(true, tag);
      }, this.ms);
    }
  }
}