import {
  EventSource,
  IEventSource,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

/**
 * Forwards input without change.
 * Mostly used in composite nodes to distribute single input to multiple atomic
 * component nodes.
 * Equivalent to `Mapper<V>((value) => value)`;
 * @example
 * let noop: Noop<number>
 * noop = new Noop();
 * noop.in.$.send(5);
 */
export class Noop<V> implements ISink, ISource, IEventSource {
  public readonly in: TInPorts<{
    $: V;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;
  public readonly svc: TEventPorts<Sink.TEventTypes | Source.TEventTypes>;

  constructor() {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(input, tag);
    }
  }
}
