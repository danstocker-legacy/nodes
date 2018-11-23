import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInPorts, TOutPorts} from "../../port";

/**
 * Forwards input with the specified delay.
 */
export class Delayer<V> implements ISink, ISource {
  public readonly in: TInPorts<{
    $: V
  }>;
  public readonly out: TOutPorts<{
    $: V
  }>;

  private readonly ms: number;

  /**
   * @param ms Delay in milliseconds.
   */
  constructor(ms: number) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.ms = ms;
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      setTimeout(() => this.out.$.send(value, tag), this.ms);
    }
  }
}
