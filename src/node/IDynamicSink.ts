import {IInPort, TInPorts} from "../port";
import {ISink} from "./ISink";

/**
 * Defines a dynamic sink node.
 * Dynamic sink nodes have a variable number of input ports on their "in"
 * port bundle.
 * All atomic nodes that receive data through variable number of input ports
 * should implement this interface.
 * @example
 * class DynamicSinkNode implements IDynamicSink {
 *   ...
 * }
 * @see ISink
 * @see DynamicSink
 */
export interface IDynamicSink extends ISink {
  /**
   * Bundle of ports through which the node receives data.
   * Imposes no restriction on port names.
   */
  in: TInPorts<{ [key: string]: any }>;

  /**
   * Adds the specified port to the input port bundle.
   * Raises exception when port already exists.
   * @param port Port to be added to inputs.
   * @param tag Identifies impulse.
   */
  addPort(port: IInPort<any>, tag?: string): void;

  /**
   * Deletes the specified port from the input port bundle.
   * Closes connection before deleting port.
   * Fails silently when port does not exist on input bundle.
   * @param port Port to be removed from inputs.
   * @param tag Identifies impulse.
   */
  deletePort(port: IInPort<any>, tag?: string): void;
}
