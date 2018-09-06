import {InPort} from "./InPort";
import {IPort} from "./IPort";

/**
 * Output port for nodes.
 */
export class OutPort<T> implements IPort<T> {
  public peer: InPort<T>;

  public connect(peer: InPort<T>): void {
    this.peer = peer;
  }

  public disconnect() {
    this.peer = undefined;
  }

  public send(value: T, tag?: string): void {
    const peer = this.peer;
    if (peer) {
      peer.send(value, tag);
    }
  }
}
