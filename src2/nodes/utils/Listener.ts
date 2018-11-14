import {ISink, Node, Sink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

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
export class Listener extends Node implements ISink {
  public readonly in: TInPorts<{
    $: any;
  }>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    super();
    Sink.init.call(this);
    this.cb = cb;
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    this.cb(value, tag);
  }
}
