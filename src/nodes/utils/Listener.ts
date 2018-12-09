import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

interface IListenerInputs {
  $: any;
}

interface IListenerEvents {
  ev_err: string;
}

/**
 * Convenience node for hooking up callbacks to output ports.
 * @example
 * const listener = new Listener((value, tag) => console.log(value, tag));
 * // to subscribe:
 * node.o.$.connect(listener.i.$);
 * // to unsubscribe:
 * listener.i.$.disconnect();
 */
export class Listener implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IListenerInputs>;
  public readonly o: TOutBundle<IListenerEvents>;
  public readonly re: TOutBundle<IListenerInputs>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["ev_err"]);
    MBouncer.init.call(this, ["$"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.i.$) {
      try {
        this.cb(value, tag);
      } catch (err) {
        this.re.$.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
