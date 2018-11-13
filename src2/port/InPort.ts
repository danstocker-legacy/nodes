import {ISink} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export class InPort<V> extends Port<ISink, V> implements IInPort<V> {
  public readonly in: true;
  public peer: IOutPort<V>;

  constructor(name: string, node: ISink) {
    super(name, node);
    this.in = true;
  }

  public connect(peer: IOutPort<V>, tag?: string): void {
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

  public send(value: V, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
