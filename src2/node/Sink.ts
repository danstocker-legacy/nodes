import {TInPorts} from "../port";
import {ISink} from "./ISink";

export namespace Sink {
  export function init(this: ISink): void {
    this.in = <TInPorts<any>> {};
  }
}
