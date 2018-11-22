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
   * Remote ports the current port is connecting to.
   * When set is empty, the port is not connected.
   */
  public readonly peers: Set<IInPort<V>>;

  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  constructor(name: string, node: any) {
    super(name, node);
    this.peers = new Set();
  }

  /**
   * Connects port to the specified remote input port.
   * Emits event after connecting.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  public connect(peer: IInPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peers.has(peer)) {
      peers.add(peer);
      peer.connect(this, tag);
    }
  }

  /**
   * Disconnects port from the specified remote input port.
   * Emits event after disconnecting.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  public disconnect(peer?: IInPort<V>, tag?: string): void {
    const peers = this.peers;
    if (!peer) {
      for (peer of peers.values()) {
        this.disconnect(peer, tag);
      }
    } else if (peers.has(peer)) {
      peers.delete(peer);
      peer.disconnect(tag);
    }
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
