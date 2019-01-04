import {TInBundle} from "../port";

/**
 * Defines a sink node.
 * Sink nodes receive data through input ports in the `i` port bundle.
 * All nodes that receive data should implement this interface.
 * @example
 * class SinkNode implements IAtomicSink {
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
}
