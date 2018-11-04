import {INode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export abstract class OutPort<T> extends Port<T> implements IOutPort<T> {
  public readonly out: true;
  public readonly peers: Set<IInPort<T>>;

  protected constructor(name: string | number, node: INode) {
    super(name, node);
    this.out = true;
    this.peers = new Set();
  }

  public connect(peer: IInPort<T>, tag?: string): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this, tag);
      this.node.onConnect(this, peer, tag);
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
      this.node.onDisconnect(this, peer, tag);
    }
  }

  public send(value: T, tag?: string): void {
    //
  }
}
