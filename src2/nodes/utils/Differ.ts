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
import {TEqualityCallback} from "./Comparer";

/**
 * Compares each input with the previous and outputs whether they are
 * different, according to the specified equality callback.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const differ = new Differ<number>((a, b) => a === b);
 * differ.in.$.send(5) // outputs `undefined` (first input)
 * differ.in.$.send(5) // outputs `false` (not different)
 * differ.in.$.send(4) // outputs `true` (is different)
 */
export class Differ<V> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: V;
  }>;
  public readonly out: TOutPorts<{
    $: boolean;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes | "CALLBACK_ERROR">;

  private readonly cb: TEqualityCallback<V>;
  private buffer: Array<V>;

  constructor(cb: TEqualityCallback<V>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
    this.buffer = [];
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<V>, value: V, tag?: string): void {
    if (port === this.in.$) {
      const buffer = this.buffer;
      buffer.push(value);
      if (buffer.length > 1) {
        const equals = this.cb(buffer.shift(), value);
        this.out.$.send(!equals, tag);
      } else {
        this.buffer = buffer;
        this.out.$.send(undefined, tag);
      }
    }
  }
}
