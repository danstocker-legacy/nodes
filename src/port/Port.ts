import {IPort} from "./IPort";

/**
 * Implements the generic port.
 * Assigns name and node properties, connects, disconnects nodes, and sends
 * data.
 * @see InPort
 * @see OutPort
 */
export abstract class Port<V> implements IPort<V> {
  /**
   * Identifies port in the context of the node it's assigned to.
   */
  public readonly name: string;

  /**
   * Node the port is assigned to.
   * Must be atomic node. (As opposed to composite nodes.)
   */
  public readonly node: any;

  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  protected constructor(name: string, node: any) {
    this.name = name;
    this.node = node;
  }

  /**
   * Connects port to remote port.
   * @param peer Remote port.
   * @param tag Identifies impulse.
   */
  public abstract connect(peer: IPort<V>, tag?: string): void;

  /**
   * Sends value to port.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  public abstract send(value: V, tag?: string): void;
}
