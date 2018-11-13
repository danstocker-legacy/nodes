import {TOutPorts} from "../port";
import {ISource} from "./ISource";

export namespace Source {
  export function init(this: ISource) {
    this.out = <TOutPorts<any>> {};
  }
}
