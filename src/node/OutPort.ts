import {InPort} from "./InPort";
import {IPort} from "./IPort";

/**
 * Output port for nodes.
 */
export class OutPort<T> implements IPort<T> {
  public peer: InPort<T>;

  public connect(peer: InPort<T>): void {
    const peerBefore = this.peer;
    if (peerBefore) {
      this.disconnect();
    }
    if (peer) {
      this.peer = peer;
      peer.node.onConnect(this, peer);
    }
  }

  public disconnect() {
    const peerBefore = this.peer;
    if (peerBefore) {
      this.peer = undefined;
      peerBefore.node.onDisconnect(this, peerBefore);
    }
  }

  public send(value: T, tag?: string): void {
    const peer = this.peer;
    if (peer) {
      peer.send(value, tag);
    }
  }
}
