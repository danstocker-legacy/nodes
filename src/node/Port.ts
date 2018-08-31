import {INode} from "./INode";

export class Port<T> {
  public readonly node: INode;
  public peer: Port<T>;

  constructor(node: INode) {
    this.node = node;
  }

  public connect(peer: Port<T>): void {
    if (this.peer) {
      this.disconnect();
    }

    this.peer = peer;
    peer.peer = this;
  }

  public disconnect(): void {
    const peer = this.peer;
    this.peer = undefined;
    peer.peer = undefined;
  }

  public in(value: T): void {
    this.node.in(this, value);
  }

  public out(value: T): void {
    const peer = this.peer;
    if (peer) {
      peer.in(value);
    }
  }
}
