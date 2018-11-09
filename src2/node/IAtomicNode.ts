import {IInPort, IPort} from "../port";
import {INode} from "./INode";

/**
 * Outlines what a node is.
 * Nodes have a set of input and output ports, which they can add, and
 * delete from. Nodes may also have data sent to them through one of their
 * input ports.
 */
export interface IAtomicNode extends INode {
  /**
   * Adds a port to the node, as the effect of an optionally identified impulse.
   * @param port Port to be added.
   * @param tag Identifies impulse.
   */
  addPort<T>(port: IPort<T>, tag?: string): void;

  /**
   * Deletes a port from the node, as the effect of an optionally identifed
   * impulse.
   * @param port Port to be deleted.
   * @param tag Identifies impulse.
   */
  deletePort<T>(port: IPort<T>, tag?: string): void;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send<T>(port: IInPort<T>, value: T, tag?: string): void;

  /**
   * Called when one of the node's ports connects.
   * @param localPort Port that belongs to the current node.
   * @param remotePort Port that belongs to the remote node.
   * @param tag Identifies impulse.
   */
  onConnect<T>(localPort: IPort<T>, remotePort: IPort<T>, tag?: string): void;

  /**
   * Called when one of the node's ports disconnects.
   * @param localPort Port that belongs to the current node.
   * @param remotePort Port that belongs to the remote node.
   * @param tag Identifies impulse.
   */
  onDisconnect<T>(localPort: IPort<T>, remotePort: IPort<T>, tag?: string): void;
}
