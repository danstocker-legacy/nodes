import {InPort, TInBundle} from "../port";
import {ISink} from "./ISink";

/**
 * Shared implementation for nodes that receive data.
 * Adds "in" port bundle to host.
 * To be mixed into classes that implement ISink.
 * @example
 * class SinkNode implements ISink {
 *   public in: TInBundle<...>
 *   ...
 *   constructor() {
 *     MSink.init.call(this, ["foo", "bar"]);
 *     ...
 *   }
 * }
 * @see ISink
 */
export namespace MSink {
  /**
   * Adds "in" port bundle.
   * @param fields Port names in input port bundle.
   */
  export function init(this: ISink, fields: Array<string> = []): void {
    const ports = this.in = {} as TInBundle<any>;
    for (const field of fields) {
      ports[field] = new InPort(field, this);
    }
  }
}
