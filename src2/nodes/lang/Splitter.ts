import {
  EventSource,
  IEventSource,
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
import {IAnything} from "../../utils";

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.in.$.connect(A.out.$);
 * splitter.out.foo.connect(B.in.$);
 * splitter.out.bar.connect(C.in.$);
 */
export class Splitter<T extends IAnything> implements ISink, ISource, IEventSource {
  public readonly in: TInPorts<{
    $: T;
  }>;
  public readonly out: TOutPorts<T>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  constructor(fields: Array<string>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    this.in.$ = new InPort("$", this);
    for (const field of fields) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send(port: IInPort<T>, input: T, tag?: string): void {
    if (port === this.in.$) {
      for (const [name, value] of Object.entries(input)) {
        this.out[name].send(value, tag);
      }
    }
  }
}
