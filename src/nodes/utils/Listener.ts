import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

interface IListenerInputs {
  d_val: any;
}

interface IListenerOutputs {
  b_d_val: any;
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
export class Listener implements ISink, ISource {
  public readonly i: TInBundle<IListenerInputs>;
  public readonly o: TOutBundle<IListenerOutputs>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["b_d_val", "ev_err"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.i.d_val) {
      try {
        this.cb(value, tag);
      } catch (err) {
        this.o.b_d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
