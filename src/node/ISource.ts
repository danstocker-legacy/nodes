import {TOutPorts} from "../port";

/**
 * Defines a source node.
 * Source nodes emit data through output ports in the "out" port bundle.
 * All atomic nodes that send data should implement this interface.
 * @example
 * class SourceNode implements ISource {
 *   ...
 * }
 * @see Source
 */
export interface ISource {
  /**
   * Bundle of ports through which the node emits data.
   */
  out: TOutPorts<any>;
}
