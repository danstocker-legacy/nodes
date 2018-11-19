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

export type TEqualityCallback<V> = (a: V, b: V, tag?: string) => boolean;

interface IComparerInputs<V> {
  a: V;
  b: V;
}

/**
 * Compares two input values and sends `true` if they match according to the
 * specified equality callback, or `false` when they don't.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * const comparer = new Comparer<number>((a, b) => a === b);
 * comparer.in.$.send({a: 4, b: 5}); // outputs `false`
 */
export class Comparer<V> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: IComparerInputs<V>;
  }>;
  public readonly out: TOutPorts<{
    $: boolean;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes | "CALLBACK_ERROR">;

  private readonly cb: TEqualityCallback<V>;

  constructor(cb: TEqualityCallback<V>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(
    port: IInPort<IComparerInputs<V>>,
    value: IComparerInputs<V>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      try {
        const equals = this.cb(value.a, value.b, tag);
        this.out.$.send(equals, tag);
      } catch (err) {
        this.svc.err.send({
          payload: {
            err,
            node: this
          },
          type: "CALLBACK_ERROR"
        }, tag);
      }
    }
  }
}
