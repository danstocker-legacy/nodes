import {INode} from './INode';

export class Port<T> {
  public node: INode;
  public peers: Array<Port<T>>;

  constructor(node: INode) {
    this.node = node;
    this.peers = [];
  }

  public in(value: T): void {
    this.node.in(this, value);
  }

  public out(value: T): void {
    const peers = this.peers;
    const peerCount = peers.length;
    for (let i = 0; i < peerCount; i++) {
      const peer = peers[i];
      peer.in['peer'] = this;
      peer.in(value);
    }
  }

  public connect(port: Port<T>) {
    this.peers.push(port);
  }
}
