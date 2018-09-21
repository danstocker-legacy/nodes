import {InPort} from "./InPort";
import {IPort} from "./IPort";

/**
 * Output port for nodes.
 */
export class OutPort<T> implements IPort<T> {
  public readonly peers: Set<InPort<T>>;

  constructor() {
    this.peers = new Set();
  }

  public connect(peer: InPort<T>): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.node.onConnect(this, peer);
    }
  }

  public disconnect(peer: InPort<T>) {
    const peers = this.peers;
    if (peers.has(peer)) {
      peers.delete(peer);
      peer.node.onDisconnect(this, peer);
    }
  }

  public send(value: T, tag?: string): void {
    for (const peer of this.peers.values()) {
      peer.send(value, tag);
    }
  }
}
