import {IAtomicNode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export class InPort<T> extends Port<T> implements IInPort<T> {
  public readonly in: true;
  public peer: IOutPort<T>;

  constructor(name: string, node: IAtomicNode<any>) {
    super(name, node);
    this.in = true;
  }

  public connect(peer: IOutPort<T>, tag?: string): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this, tag);
    } else if (peer !== this.peer) {
      throw new Error(`Input port "${this.name}" already connected.`);
    }
  }

  public disconnect(tag?: string): void {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.disconnect(this, tag);
    }
  }

  public send(value: T, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
