import {
  EventEmitter,
  ISink,
  ISource,
  Sink,
  Source,
  TNodeEventTypes
} from "../../node";
import {Serviced} from "../../node/Serviced";
import {
  IInPort,
  InPort,
  OutPort,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

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
  public readonly svc: TEventPorts<TNodeEventTypes>;

  private readonly ms: number;

  /**
   * @param ms Delay in milliseconds.
   */
  constructor(ms: number) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventEmitter.init.call(this);
    this.ms = ms;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      setTimeout(() => this.out.$.send(value, tag), this.ms);
    }
  }
}