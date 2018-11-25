import {OutPort} from "../port";
import {IBouncer} from "./IBouncer";

export namespace MBouncer {
  export function init(this: IBouncer, fields: Array<string>): void {
    const bundle = this.bounced = {};
    for (const field of fields) {
      bundle[field] = new OutPort(field, this);
    }
  }
}
