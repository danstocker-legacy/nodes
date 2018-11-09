import {TInPorts, TOutPorts} from "../port";

/**
 * A node has at least one input and one output socket.
 */
export interface INode {
  /** Input ports of the node. */
  readonly in: TInPorts;

  /** Output ports of the node. */
  readonly out: TOutPorts;
}
