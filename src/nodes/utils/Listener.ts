import {ISink, MSink} from "../../node";
import {IInPort, TInBundle} from "../../port";

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
  public readonly in: TInBundle<{
    $: any;
  }>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.in.$) {
      this.cb(value, tag);
    }
  }
}
