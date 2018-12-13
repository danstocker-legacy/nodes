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
   * Remote ports the current port is connected to.
   * When set is empty, the port is not connected.
   */
  public readonly peers: Set<IPort<V>>;

  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  protected constructor(name: string, node: any) {
    this.name = name;
    this.node = node;
    this.peers = new Set();
  }

  /**
   * Connects port to the specified remote port.
   * Emits event after connecting.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  public connect(peer: IPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this, tag);
    }
  }

  /**
   * Disconnects port from the specified remote port.
   * Emits event after disconnecting.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  public disconnect(peer?: IPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peer) {
      for (peer of peers.values()) {
        this.disconnect(peer, tag);
      }
    } else if (peers.has(peer)) {
      peers.delete(peer);
      peer.disconnect(this, tag);
    }
  }

  /**
   * Sends value to port.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  public abstract send(value: V, tag?: string): void;
}
