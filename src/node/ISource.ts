import {TOutBundle} from "../port";

/**
 * Defines a source node.
 * MSource nodes emit data through output ports in the "o" port bundle.
 * All atomic nodes that send data should implement this interface.
 * @example
 * class SourceNode implements ISource {
 *   ...
 * }
 * @see MSource
 */
export interface ISource {
  /**
   * Data output port bundle.
   * The node emits data through these ports.
   */
  o: TOutBundle<any>;
}
