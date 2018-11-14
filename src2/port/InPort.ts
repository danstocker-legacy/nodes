import {ISink} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export class InPort<V> extends Port<V> implements IInPort<V> {
  public node: ISink;
  public peer: IOutPort<V>;

  constructor(name: string, node: ISink) {
    super(name, node);
  }

  public connect(peer: IOutPort<V>, tag?: string): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this, tag);
      this.node.svc.evt.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_CONNECT"
      }, tag);
    } else if (peer !== this.peer) {
      throw new Error(`Input port "${this.name}" already connected.`);
    }
  }

  public disconnect(tag?: string): void {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.disconnect(this, tag);
      this.node.svc.evt.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_DISCONNECT"
      }, tag);
    }
  }

  public send(value: V, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
