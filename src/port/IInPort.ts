import {ISink} from "../node";
import {IOutPort} from "./IOutPort";
import {IPort} from "./IPort";

/**
 * Describes an input port.
 * Input ports are assigned to sink nodes, and connect to a single output port.
 */
export interface IInPort<V> extends IPort<V> {
  /**
   * Node the port is assigned to.
   * Must be sink node.
   */
  node: ISink;

  /**
   * Remote port the current port is connecting to.
   * When this is undefined, the port is not connected.
   */
  peer: IOutPort<V>;

  /**
   * Connects port to the specified remote output port.
   * @param peer Remote output port.
   * @param tag Identifies impulse.
   */
  connect(peer: IOutPort<V>, tag?: string): void;

  /**
   * Disconnects port from peer.
   * @param tag Identifies impulse.
   */
  disconnect(tag?: string): void;
}
