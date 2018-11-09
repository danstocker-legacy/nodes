import {IAtomicNode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export class OutPort<T> extends Port<T> implements IOutPort<T> {
  public readonly out: true;
  public readonly peers: Set<IInPort<T>>;

  constructor(name: string, node: IAtomicNode) {
    super(name, node);
    this.out = true;
    this.peers = new Set();
  }

  public connect(peer: IInPort<T>, tag?: string): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this, tag);
    }
  }

  public disconnect(peer?: IInPort<T>, tag?: string): void {
    const peers = this.peers;
    if (!peer) {
      for (peer of peers.values()) {
        this.disconnect(peer, tag);
      }
    } else if (peers.has(peer)) {
      peers.delete(peer);
      peer.disconnect(tag);
    }
  }

  public send(value: T, tag?: string): void {
    for (const peer of this.peers.values()) {
      peer.send(value, tag);
    }
  }
}
