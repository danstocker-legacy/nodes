import {TOutPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Implements shared methods for classes that implement IServiced.
 * Adds the service port bundle property `svc`.
 * By default, all node classes incorporate `Serviced` through the base
 * class `Node`, so there's no need for node classes to call into `Serviced`
 * manually.
 */
export namespace Serviced {
  export function init(this: IServiced): void {
    this.svc = <TOutPorts<any>> {};
  }
}
