import {IPort} from "./IPort";
import {NodeBase} from "./NodeBase";
import {OutPort} from "./OutPort";

/**
 * Input port for nodes.
 */
export class InPort<T> implements IPort<T> {
  public readonly node: NodeBase;
  public readonly permanent: boolean;
  public peer: OutPort<T>;

  constructor(node: NodeBase, permanent: boolean = false) {
    this.node = node;
    this.permanent = permanent;
  }

  public connect(peer: OutPort<T>): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this);
      this.node.onConnect(peer, this);
    } else if (peer !== this.peer) {
      throw new Error("Input port already connected.");
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
