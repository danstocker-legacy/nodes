import {OutPort} from "../port";
import {IFailedInputSource} from "./IFailedInputSource";

/**
 * Mixin with shared methods for node classes that implement IFailedInputSource.
 * @example
 * class MyNode implements IFailedInputSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     FailedInputSource.init.call(this);
 *   }
 * }
 */
export namespace FailedInputSource {
  export function init(this: IFailedInputSource): void {
    this.svc.fail = new OutPort("fail", this);
  }
}
