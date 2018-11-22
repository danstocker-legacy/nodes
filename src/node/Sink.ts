import {InPort, TInPorts} from "../port";
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
 *     Sink.init.call(this, ["foo", "bar"]);
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
   * @param fields Port names in input port bundle.
   */
  export function init(this: ISink, fields: Array<string> = []): void {
    const ports = this.in = {} as TInPorts<any>;
    for (const field of fields) {
      ports[field] = new InPort(field, this);
    }
  }
}
