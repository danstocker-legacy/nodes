import {INode} from "../node";
import {IPort} from "./IPort";

/**
 * Implements the generic port.
 * Assigns name and node properties, connects, disconnects nodes, and sends
 * data.
 * Do not use Port directly.
 * @see InPort
 * @see OutPort
 */
export abstract class Port<V> implements IPort<V> {
  public readonly name: string;
  public readonly node: INode;

  protected constructor(name: string, node: INode) {
    this.name = name;
    this.node = node;
  }

  public abstract connect(peer: IPort<V>, tag?: string): void;

  public abstract send(value: V, tag?: string): void;
}
