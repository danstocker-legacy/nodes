import {OutPort} from "../port";
import {IErrorSource} from "./IErrorSource";

/**
 * Mixin with shared methods for node classes that implement IErrorSource.
 * @example
 * class MyNode implements IErrorSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     ErrorSource.init.call(this);
 *   }
 * }
 */
export namespace ErrorSource {
  export function init(this: IErrorSource): void {
    this.svc.err = new OutPort("err", this);
  }
}
