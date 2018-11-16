import {EventEmitter, ISink, Serviced, Sink, TNodeEventTypes} from "../../node";
import {IInPort, InPort, TEventPorts, TInPorts} from "../../port";

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
export class Listener implements ISink {
  public readonly in: TInPorts<{
    $: any;
  }>;
  public readonly svc: TEventPorts<TNodeEventTypes>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    Sink.init.call(this);
    Serviced.init.call(this);
    EventEmitter.init.call(this);
    this.cb = cb;
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    this.cb(value, tag);
  }
}
