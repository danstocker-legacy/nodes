import {TOutPorts} from "../port";
import {ISource} from "./ISource";

export namespace Source {
  export type EventTypes = "PORT_CONNECT" | "PORT_DISCONNECT";

  export function init(this: ISource): void {
    this.out = <TOutPorts<any>> {};
  }
}
