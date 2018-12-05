import {OutPort, TOutBundle} from "../port";
import {IEvented} from "./IEvented";

export namespace MEvented {
  export function init(this: IEvented, fields: Array<string>) {
    const ports = this.e = {} as TOutBundle<any>;
    for (const field of fields) {
      ports[field] = new OutPort(field, this);
    }
  }
}
