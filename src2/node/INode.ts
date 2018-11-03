import {IDynamicPort, IInPort, IPort, TInPorts, TOutPorts} from "../port";

/**
 * Outlines what a node is.
 * Nodes have a set of input and output ports, which they can add, and
 * delete from. Nodes may also have data sent to them through one of their
 * input ports.
 */
export interface INode {
  /** Input ports of the node. */
  readonly in: TInPorts;

  /** Output ports of the node. */
  readonly out: TOutPorts;

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
  deletePort<T>(port: IDynamicPort<T>, tag?: string): void;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
