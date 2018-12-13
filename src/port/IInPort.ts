import {IOutPort} from "./IOutPort";
import {IPort} from "./IPort";

/**
 * Describes an input port.
 * Input ports are assigned to sink nodes, and connect to a single output port.
 */
export interface IInPort<V> extends IPort<V> {
  /**
   * Remote ports the current port is connecting to.
   * When set is empty, the port is not connected.
   */
  peers: Set<IOutPort<V>>;

  /**
   * Connects port to the specified remote output port.
   * @param peer Remote output port.
   * @param tag Identifies impulse.
   */
  connect(peer: IOutPort<V>, tag?: string): void;

  /**
   * Disconnects port from the specified remote output port.
   * @param peer Remote output port.
   * @param tag Identifies impulse.
   */
  disconnect(peer?: IOutPort<V>, tag?: string): void;
}
