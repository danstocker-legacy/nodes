/**
 * Describes a generic port.
 * Nodes communicate through ports. Input ports receive data and connect to
 * output ports, output ports emit data and connect to input ports.
 * Ports are associated with the type (V) of data they transfer.
 * Each port is assigned to a single node, in the context of which it's
 * identified by a name.
 * @see IInPort
 * @see IOutPort
 */
export interface IPort<V> {
  /**
   * Identifies port in the context of the node it's assigned to.
   */
  name: string;

  /**
   * Node the port is assigned to.
   * Must be atomic node. (As opposed to composite nodes.)
   */
  node: any;

  /**
   * Connects port to remote port.
   * @param peer Remote port.
   * @param tag Identifies impulse.
   */
  connect(peer: IPort<V>, tag?: string): void;

  /**
   * Sends value to port.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  send(value: V, tag?: string): void;
}
