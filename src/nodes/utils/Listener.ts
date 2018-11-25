import {IBouncer, ISink, MBouncer, MSink} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

interface IListenerInputs {
  $: any;
}

/**
 * Convenience node for hooking up callbacks to output ports.
 * @example
 * const listener = new Listener((value, tag) => console.log(value, tag));
 * // to subscribe:
 * node.out.$.connect(listener.in.$);
 * // to unsubscribe:
 * listener.in.$.disconnect();
 */
export class Listener implements ISink, IBouncer {
  public readonly in: TInBundle<IListenerInputs>;
  public readonly bounced: TOutBundle<IListenerInputs>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.in.$) {
      try {
        this.cb(value, tag);
      } catch (err) {
        this.bounced.$.send(value, tag);
      }
    }
  }
}
