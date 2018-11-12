import {TNode} from "../node";
import {IPort} from "./IPort";

/**
 * Implements the generic port.
 * Assigns name and node properties, connects, disconnects nodes, and sends
 * data.
 * Do not use Port directly.
 * @see InPort
 * @see OutPort
 */
export abstract class Port<N extends TNode<any, any>, V> implements IPort<N, V> {
  public readonly name: string;
  public readonly node: N;

  protected constructor(name: string, node: N) {
    this.name = name;
    this.node = node;
  }

  public abstract connect(peer: IPort<TNode<any, any>, V>, tag?: string): void;

  public abstract send(value: V, tag?: string): void;
}
