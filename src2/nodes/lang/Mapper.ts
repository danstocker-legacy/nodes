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

type TMapperCallback<I, O> = (value: I, tag: string, node: ISink) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: I;
  }>;
  public readonly out: TOutPorts<{
    $: O;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes | "CALLBACK_ERROR">;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<I>, input: I, tag?: string): void {
    if (port === this.in.$) {
      try {
        const mapped = this.cb(input, tag, this);
        this.out.$.send(mapped, tag);
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
