import {OutPort} from "../port";
import {IStateful} from "./IStateful";

export namespace MStateful {
  export function init(this: IStateful, fields: Array<string>) {
    this.state = {};
    const bundle = this.state = {};
    for (const field of fields) {
      bundle[field] = new OutPort(field, this);
    }
  }
}
