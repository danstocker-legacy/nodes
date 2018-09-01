import {IPort} from "./IPort";
import {INode} from "./INode";
import {InPort} from "./InPort";

export class OutPort<T> implements IPort<T> {
  public readonly node: INode;
  public peer: InPort<T>;

  constructor(node: INode) {
    this.node = node;
  }

  public connect(peer: InPort<T>): void {
    if (this.peer) {
      this.disconnect();
    }

    this.peer = peer;
    peer.peer = this;
  }

  public disconnect() {
    const peer = this.peer;
    this.peer = undefined;
    peer.peer = undefined;
  }

  public send(value: T): void {
    const peer = this.peer;
    if (peer) {
      peer.send(value);
    }
  }
}
