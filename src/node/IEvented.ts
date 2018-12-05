import {TOutBundle} from "../port";

/**
 * Describes an evented node.
 * Evented nodes emit events through ports in the `e` port bundle.
 * Events are one-off, and are not related to state changes. (Eg errors.)
 * For communicating state changes, use `IStateful`.
 * @example
 * class EventedNode implements IEvented {
 *   public readonly e: TOutBundle<...>
 *   ...
 * }
 * @see MEvented
 * @see IStateful
 */
export interface IEvented {
  /**
   * Event port bundle.
   * Connect to these ports to receive events from the node.
   */
  e: TOutBundle<any>;
}
