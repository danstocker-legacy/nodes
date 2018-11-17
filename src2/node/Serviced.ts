import {TOutPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Shared implementation for nodes that emit service data.
 * Serviced nodes are able to emit events, errors, or failed inputs.
 * Adds "svc" (service) output port bundle to host.
 * To be mixed into classes that implement IServiced, either directly, or
 * through specific service interfaces like IEventSource, IErrorSource, or
 * IFailedInputSource.
 * @example
 * class ServicedNode implements IServiced {
 *   public svc: TOutPorts<...>
 *   ...
 *   constructor() {
 *     Serviced.init.call(this);
 *     ...
 *   }
 * }
 * @see IServiced
 */
export namespace Serviced {
  /**
   * Adds "svc" output port bundle.
   */
  export function init(this: IServiced): void {
    this.svc = <TOutPorts<any>> {};
  }
}
