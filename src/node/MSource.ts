import {OutPort, TOutBundle} from "../port";
import {ISource} from "./ISource";

/**
 * Shared implementation for nodes that emit data.
 * Adds "o" port bundle to host.
 * To be mixed into classes that implement ISource.
 * @example
 * class SourceNode implements ISource {
 *   public o: TOutBundle<...>
 *   ...
 *   constructor() {
 *     MSource.init.call(this);
 *     ...
 *   }
 * }
 * @see ISource
 */
export namespace MSource {
  /**
   * Adds "o" port bundle.
   * @param fields Port names in output port bundle.
   */
  export function init(this: ISource, fields: Array<string> = []): void {
    const ports = this.o = {} as TOutBundle<any>;
    for (const field of fields) {
      ports[field] = new OutPort(field, this);
    }
  }
}
