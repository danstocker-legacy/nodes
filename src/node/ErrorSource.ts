import {OutPort} from "../port";
import {IErrorSource} from "./IErrorSource";

/**
 * Shared implementation for nodes that report errors.
 * Adds "err" (error) output port to the host's "svc" (service) port bundle.
 * To be mixed into classes that implement IErrorSource.
 * @example
 * class ErrorSourceNode implements IErrorSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     ErrorSource.init.call(this);
 *   }
 * }
 * @see IErrorSource
 */
export namespace ErrorSource {
  /**
   * Adds "err" port to service port bundle.
   * Service port bundle is expected to be already initialized. (By Serviced
   * mixin.)
   * @see Serviced
   */
  export function init(this: IErrorSource): void {
    this.svc.err = new OutPort("err", this);
  }
}
