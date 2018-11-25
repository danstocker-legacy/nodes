import {IOutPort, TOutBundle} from "../port";
import {ISource} from "./ISource";

/**
 * Defines a dynamic source node.
 * Dynamic source nodes have a variable number of output ports on their
 * "out" port bundle.
 * All atomic nodes that emit data through variable number of output ports
 * should implement this interface.
 * @example
 * class DynamicSourceNode implements IDynamicSource {
 *   ...
 * }
 * @see ISource
 * @see MDynamicSource
 */
export interface IDynamicSource extends ISource {
  /**
   * Bundle of ports through which the node emits data.
   * Imposes no restriction on port names.
   */
  out: TOutBundle<{ [key: string]: any }>;

  /**
   * Adds the specified port to the output port bundle.
   * Raises exception when port already exists.
   * @param port Port to be added to outputs.
   * @param tag Identifies impulse.
   */
  addPort(port: IOutPort<any>, tag?: string): void;

  /**
   * Deletes the specified port from the output port bundle.
   * Closes connection before deleting port.
   * Fails silently when port does not exist on output bundle.
   * @param port Port to be removed from outputs.
   * @param tag Identifies impulse.
   */
  deletePort(port: IOutPort<any>, tag?: string): void;
}
