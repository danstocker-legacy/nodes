import {ISink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

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
export class Listener implements ISink<IListenerInputs> {
  public readonly in: TInPorts<IListenerInputs>;

  private readonly cb: TListenerCallback;

  constructor(cb: TListenerCallback) {
    this.cb = cb;
    this.in = {
      $: new InPort("$", this)
    };
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    this.cb(value, tag);
  }
}
