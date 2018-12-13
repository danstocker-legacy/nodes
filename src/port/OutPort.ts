import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

/**
 * Implements the output port.
 * Connects, disconnects nodes, and sends data.
 * Assigned node must implement the IEventSource interface.
 */
export class OutPort<V> extends Port<V> implements IOutPort<V> {
  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  constructor(name: string, node: any) {
    super(name, node);
  }

  /**
   * Sends value to port.
   * Distributes value to connected input ports.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  public send(value: V, tag?: string): void {
    for (const peer of this.peers.values()) {
      peer.send(value, tag);
    }
  }
}
