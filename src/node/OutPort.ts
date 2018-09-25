import {InPort} from "./InPort";
import {IPort} from "./IPort";
import {NodeBase} from "./NodeBase";

/**
 * Output port for nodes.
 */
export class OutPort<T> implements IPort<T> {
  public readonly node: NodeBase;
  public readonly peers: Set<InPort<T>>;

  constructor(node: NodeBase) {
    this.node = node;
    this.peers = new Set();
  }

  public connect(peer: InPort<T>): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this);
      this.node.onConnect(this, peer);
    }
  }

  public disconnect(peer?: InPort<T>) {
    const peers = this.peers;
    if (!peer) {
      for (peer of peers.values()) {
        this.disconnect(peer);
      }
    } else if (peers.has(peer)) {
      peers.delete(peer);
      peer.disconnect();
      this.node.onDisconnect(this, peer);
    }
  }

  public send(value: T, tag?: string): void {
    for (const peer of this.peers.values()) {
      peer.send(value, tag);
    }
  }
}
