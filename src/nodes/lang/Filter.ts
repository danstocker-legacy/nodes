import {
  ErrorSource,
  EventSource,
  IErrorSource,
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
  TErrorPorts,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

interface IFilterInput<V> {
  val: V;
  incl: boolean;
}

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Filter<V> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: IFilterInput<V>;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  constructor() {
    Sink.init.call(this, ["$"]);
    Source.init.call(this, ["$"]);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
  }

  public send(port: IInPort<IFilterInput<V>>, input: IFilterInput<V>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
