import {TOutPorts} from "../port";
import {ISource} from "./ISource";

export namespace Source {
  export type TEventTypes = "PORT_CONNECT" | "PORT_DISCONNECT";

  export function init(this: ISource): void {
    this.out = <TOutPorts<any>> {};
  }
}
