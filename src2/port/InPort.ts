import {IAtomicNode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export abstract class InPort<T> extends Port<T> implements IInPort<T> {
  public readonly in: true;
  public peer: IOutPort<T>;

  protected constructor(name: string | number, node: IAtomicNode) {
    super(name, node);
    this.in = true;
  }

  public connect(peer: IOutPort<T>, tag?: string): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this, tag);
      this.node.onConnect(this, peer, tag);
    } else if (peer !== this.peer) {
      throw new Error(`Input port "${this.name}" already connected.`);
    }
  }

  public disconnect(tag?: string): void {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.disconnect(this, tag);
      this.node.onDisconnect(this, peer, tag);
    }
  }

  public send(value: T, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
