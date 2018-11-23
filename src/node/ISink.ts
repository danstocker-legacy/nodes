import {IInPort, TInPorts} from "../port";

/**
 * Defines a sink node.
 * MSink nodes receive data through input ports in the "in" port bundle.
 * All atomic nodes that receive data should implement this interface.
 * @example
 * class SinkNode implements ISink {
 *   ...
 * }
 * @see MSink
 */
export interface ISink {
  /**
   * Bundle of ports through which the node receives data.
   */
  in: TInPorts<any>;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send(port: IInPort<any>, value: any, tag?: string): void;
}
