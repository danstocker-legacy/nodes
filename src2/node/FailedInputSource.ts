import {OutPort} from "../port";
import {IFailedInputSource} from "./IFailedInputSource";

/**
 * Shared implementation for nodes that report failed inputs.
 * Adds "fail" (input failure) port to the host's "svc" (service) port bundle.
 * To be mixed into classes that implement IFailedInputSource.
 * @example
 * class FailedInputSourceNode implements IFailedInputSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     FailedInputSource.init.call(this);
 *   }
 * }
 */
export namespace FailedInputSource {
  /**
   * Adds "fail" port to service port bundle.
   * Service port bundle is expected to be already initialized. (By Serviced
   * mixin.)
   * @see Serviced
   */
  export function init(this: IFailedInputSource): void {
    this.svc.fail = new OutPort("fail", this);
  }
}
