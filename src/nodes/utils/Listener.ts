import {
  ErrorSource,
  EventSource,
  IErrorSource,
  IEventSource,
  ISink,
  Serviced,
  Sink
} from "../../node";
import {IInPort, InPort, TErrorPorts, TEventPorts, TInPorts} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

/**
 * Convenience node for hooking up callbacks to output ports.
 * @example
 * const listener = new Listener((value, tag) => console.log(value, tag));
 * // to subscribe:
 * node.out.$.connect(listener.in.$);
 * // to unsubscribe:
 * listener.in.$.disconnect();
 */
export class Listener implements ISink, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: any;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    Sink.init.call(this, ["$"]);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.in.$) {
      this.cb(value, tag);
    }
  }
}
