import {TOutPorts} from "../port";
import {IServiced} from "./IServiced";

export namespace Serviced {
  export function init(this: IServiced) {
    this.svc = <TOutPorts<any>> {};
  }
}
