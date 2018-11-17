import {IEventEmitter} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export class OutPort<V> extends Port<V> implements IOutPort<V> {
  public readonly peers: Set<IInPort<V>>;

  constructor(name: string, node: any) {
    super(name, node);
    this.peers = new Set();
  }

  public connect(peer: IInPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this, tag);
      this.node.svc.evt.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_CONNECT"
      }, tag);
    }
  }

  public disconnect(peer?: IInPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peer) {
      for (peer of peers.values()) {
        this.disconnect(peer, tag);
      }
    } else if (peers.has(peer)) {
      peers.delete(peer);
      peer.disconnect(tag);
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
    for (const peer of this.peers.values()) {
      peer.send(value, tag);
    }
  }
}
