import {OutPort, TOutBundle} from "../port";
import {IStateful} from "./IStateful";

export namespace MStateful {
  export function init(this: IStateful, fields: Array<string>) {
    const ports = this.so = {} as TOutBundle<any>;
    for (const field of fields) {
      ports[field] = new OutPort(field, this);
    }
  }
}
