import {TOutBundle} from "../port";

/**
 * Defines a source node.
 * MSource nodes emit data through output ports in the "out" port bundle.
 * All atomic nodes that send data should implement this interface.
 * @example
 * class SourceNode implements ISource {
 *   ...
 * }
 * @see MSource
 */
export interface ISource {
  /**
   * Bundle of ports through which the node emits data.
   */
  out: TOutBundle<any>;
}
