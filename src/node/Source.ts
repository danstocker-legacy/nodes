import {OutPort, TOutPorts} from "../port";
import {ISource} from "./ISource";

/**
 * Shared implementation for nodes that emit data.
 * Adds "out" port bundle to host.
 * To be mixed into classes that implement ISource.
 * @example
 * class SourceNode implements ISource {
 *   public out: TOutPorts<...>
 *   ...
 *   constructor() {
 *     Source.init.call(this);
 *     ...
 *   }
 * }
 * @see Source
 */
export namespace Source {
  /**
   * Event types specific to source nodes.
   */
  export type TEventTypes = "PORT_CONNECT" | "PORT_DISCONNECT";

  /**
   * Adds "out" port bundle.
   * @param fields Port names in output port bundle.
   */
  export function init(this: ISource, fields: Array<string> = []): void {
    const ports = this.out = {} as TOutPorts<any>;
    for (const field of fields) {
      ports[field] = new OutPort(field, this);
    }
  }
}
