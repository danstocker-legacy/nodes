import {TInBundle} from "../port";

/**
 * Describes a node with mutable state.
 * Mutable nodes receive state through input ports in the `si` port bundle.
 * The new state is not guaranteed to set at all, and when it does, it might
 * do so with a delay. Nodes that behave like this usually also implement
 * `IStateful` giving the environment a chance to know when the state updated.
 * @example
 * class MutableNode implements IMutable {
 *   public readonly si: TInBundle<...>
 *   ...
 * }
 * @see MMutable
 * @see IStateful
 */
export interface IMutable {
  /**
   * State input port bundle.
   * Send values through these ports to control the state of the node.
   */
  si: TInBundle<any>;
}
