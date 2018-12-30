import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

interface IListenerInputs {
  d_val: any;
}

interface IListenerOutputs {
  /** Error message */
  ev_err: string;
}

/**
 * Convenience node for hooking up callbacks to output ports.
 * @example
 * const listener = new Listener((value, tag) => console.log(value, tag));
 * // to subscribe:
 * node.o.d_val.connect(listener.i.d_val);
 * // to unsubscribe:
 * listener.i.d_val.disconnect();
 */
export class Listener implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IListenerInputs>;
  public readonly o: TOutBundle<IListenerOutputs>;
  public readonly b: TOutBundle<IListenerInputs>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["ev_err"]);
    MBouncer.init.call(this, ["d_val"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.i.d_val) {
      try {
        this.cb(value, tag);
      } catch (err) {
        this.b.d_val.send(value, tag);
        this.o.ev_err.send(String(err), tag);
      }
    }
  }
}
