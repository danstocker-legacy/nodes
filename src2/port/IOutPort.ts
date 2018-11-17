import {IInPort} from "./IInPort";
import {IPort} from "./IPort";

/**
 * Describes an output port.
 * Output ports may be assigned to any node, and connect to multiple input
 * ports.
 */
export interface IOutPort<V> extends IPort<V> {
  /**
   * Remote ports the current port is connecting to.
   * When set is empty, the port is not connected.
   */
  peers: Set<IInPort<V>>;

  /**
   * Connects port to the specified remote input port.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  connect(peer: IInPort<V>, tag?: string): void;

  /**
   * Disconnects port from the specified remote input port.
   * @param peer Remote input port.
   * @param tag Identifies impulse.
   */
  disconnect(peer?: IInPort<V>, tag?: string): void;
}
