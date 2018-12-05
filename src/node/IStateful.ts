import {TOutBundle} from "../port";

/**
 * Describes a stateful node.
 * Stateful nodes emit changes in its state through ports in the `so` port
 * bundle.
 * Nodes with state that can be changed externally must also implement
 * `IMutable`.
 * @example
 * class StatefulNode implements IStateful {
 *   public readonly so: TOutBundle<...>
 *   ...
 * }
 * @see MStateful
 * @see IMutable
 */
export interface IStateful {
  /**
   * State output port bundle.
   * Connect to these nodes to receive updates to the node's sate.
   */
  so: TOutBundle<any>;
}
