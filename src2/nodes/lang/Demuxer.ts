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
import {IMuxed} from "../../utils";

/**
 * De-multiplexes input.
 * Distributes impulses to output port specified by input.
 * @example
 * let demuxer: Demuxer<{foo: number, bar: boolean}>;
 * demuxer = new Demuxer(["foo", "bar"]);
 * demuxer.in.$.send({name: "foo", 5});
 * // outputs `5` on port "foo"
 */
export class Demuxer<T> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: IMuxed<T>;
  }>;
  public readonly out: TOutPorts<T>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  constructor(fields: Array<string>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.in.$ = new InPort("$", this);
    for (const field of fields) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send(port: IInPort<IMuxed<T>>, input: IMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.val, tag);
    }
  }
}
