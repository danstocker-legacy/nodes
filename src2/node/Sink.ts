import {TInPorts} from "../port";
import {ISink} from "./ISink";

export namespace Sink {
  export type TEventTypes = "PORT_CONNECT" | "PORT_DISCONNECT";

  export function init(this: ISink): void {
    this.in = <TInPorts<any>> {};
  }
}
