import {INode} from "./INode";
import {InPort} from "./InPort";
import {IPort} from "./IPort";

/**
 * Output port for nodes.
 */
export class OutPort<T> implements IPort<T> {
  public readonly node: INode;
  public peer: InPort<T>;

  constructor(node: INode) {
    this.node = node;
  }

  /**
   * Connects current port to an input port.
   */
  public connect(peer: InPort<T>): void {
    if (this.peer) {
      this.disconnect();
    }

    this.peer = peer;
    peer.peer = this;
  }

  /**
   * Disconnects current port from connected input port.
   */
  public disconnect() {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.peer = undefined;
    }
  }

  /**
   * Sends value to te current port. To be called by INode classes only.
   */
  public send(value: T): void {
    const peer = this.peer;
    if (peer) {
      peer.send(value);
    }
  }
}
