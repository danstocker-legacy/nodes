import {INode} from "./INode";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";

/**
 * Input port for nodes.
 */
export class InPort<T> implements IPort<T> {
  public readonly node: INode;
  public peer: OutPort<T>;

  constructor(node: INode) {
    this.node = node;
  }

  /**
   * TODO: Throw when already connected?
   */
  public connect(peer: OutPort<T>): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this);
      this.node.onConnect(peer, this);
    }
  }

  public disconnect(): void {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.disconnect(this);
      this.node.onDisconnect(peer, this);
    }
  }

  public send(value: T, tag?: string): void {
    this.node.send(new Map([[this, value]]), tag);
  }
}
