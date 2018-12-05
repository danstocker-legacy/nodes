import {IInPort, TInBundle} from "../port";

/**
 * Defines a sink node.
 * Sink nodes receive data through input ports in the `i` port bundle.
 * All atomic nodes that receive data should implement this interface.
 * @example
 * class SinkNode implements ISink {
 *   public readonly i: TInBundle<...>
 *   ...
 * }
 * @see MSink
 */
export interface ISink {
  /**
   * Data input port bundle.
   * The node receives data through these ports.
   */
  i: TInBundle<any>;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send(port: IInPort<any>, value: any, tag?: string): void;
}
