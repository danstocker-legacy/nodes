import {TOutPorts} from "../port";
import {ISource} from "./ISource";

export namespace Source {
  export function init(this: ISource): void {
    this.out = <TOutPorts<any>> {};
  }
}
