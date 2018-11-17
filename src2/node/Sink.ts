import {TInPorts} from "../port";
import {ISink} from "./ISink";

/**
 * Shared implementation for nodes that receive data.
 * Adds "in" port bundle to host.
 * To be mixed into classes that implement ISink.
 * @example
 * class SinkNode implements ISink {
 *   public in: TInPorts<...>
 *   ...
 *   constructor() {
 *     Sink.init.call(this);
 *     ...
 *   }
 * }
 * @see ISink
 */
export namespace Sink {
  /**
   * Event types specific to sink nodes.
   */
  export type TEventTypes = "PORT_CONNECT" | "PORT_DISCONNECT";

  /**
   * Error types specific to sink nodes.
   */
  export type TErrorTypes = "PORT_ALREADY_CONNECTED";

  /**
   * Adds "in" port bundle.
   */
  export function init(this: ISink): void {
    this.in = <TInPorts<any>> {};
  }
}
