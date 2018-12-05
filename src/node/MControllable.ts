import {InPort, TInBundle} from "../port";
import {IControllable} from "./IControllable";

export namespace MControllable {
  export function init(this: IControllable, fields: Array<string>) {
    const ports = this.si = {} as TInBundle<any>;
    for (const field of fields) {
      ports[field] = new InPort(field, this);
    }
  }
}
