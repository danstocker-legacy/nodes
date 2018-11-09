import {IInPort} from "../port";
import {INode} from "./INode";

/**
 * Outlines what a node is.
 * Nodes have a set of input and output ports, which they can add, and
 * delete from. Nodes may also have data sent to them through one of their
 * input ports.
 */
export interface IAtomicNode extends INode {
  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
