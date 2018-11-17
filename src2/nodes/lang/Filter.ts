import {
  EventEmitter,
  IEventEmitter,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source,
  TNodeEventTypes
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
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
export class Filter<V> implements ISink, ISource, IEventEmitter {
  public readonly in: TInPorts<{
    $: IFilterInput<V>;
  }>;
  public readonly out: TOutPorts<{
    $: V;
  }>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor() {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventEmitter.init.call(this);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<IFilterInput<V>>, input: IFilterInput<V>, tag?: string): void {
    if (port === this.in.$ && input.incl) {
      this.out.$.send(input.val, tag);
    }
  }
}
