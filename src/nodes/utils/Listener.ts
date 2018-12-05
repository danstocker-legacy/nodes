import {
  IBouncer,
  IEvented,
  ISink,
  MBouncer,
  MEvented,
  MSink,
  MSource
} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

type TListenerCallback = (value: any, tag?: string) => void;

interface IListenerInputs {
  $: any;
}

interface IListenerEvents {
  err: string;
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
export class Listener implements ISink, IBouncer, IEvented {
  public readonly i: TInBundle<IListenerInputs>;
  public readonly re: TOutBundle<IListenerInputs>;
  public readonly e: TOutBundle<IListenerEvents>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    MSink.init.call(this, ["$"]);
    MBouncer.init.call(this, ["$"]);
    MEvented.init.call(this, ["err"]);
    this.cb = cb;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.i.$) {
      try {
        this.cb(value, tag);
      } catch (err) {
        this.re.$.send(value, tag);
        this.e.err.send(String(err), tag);
      }
    }
  }
}
