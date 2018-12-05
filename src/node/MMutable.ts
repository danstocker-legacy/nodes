import {InPort, TInBundle} from "../port";
import {IMutable} from "./IMutable";

export namespace MMutable {
  export function init(this: IMutable, fields: Array<string>) {
    const ports = this.si = {} as TInBundle<any>;
    for (const field of fields) {
      ports[field] = new InPort(field, this);
    }
  }
}
