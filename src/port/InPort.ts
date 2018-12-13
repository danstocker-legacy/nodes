import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

/**
 * Implements the input port.
 * Connects, disconnects nodes, and sends data.
 * Assigned node must implement the IEventSource and IErrorSource interfaces.
 */
export class InPort<V> extends Port<V> implements IInPort<V> {
  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  constructor(name: string, node: any) {
    super(name, node);
  }

  /**
   * Sends value to port.
   * Forwards value to assigned node.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  public send(value: V, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
