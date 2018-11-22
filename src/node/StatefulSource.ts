import {OutPort, TMetaBundles} from "../port";
import {IStatefulSource} from "./IStatefulSource";

export namespace StatefulSource {
  export function init(this: IStatefulSource, fields: Array<string>) {
    const bundle = this.change;
    bundle.out = {} as TMetaBundles<any>;
    for (const field of fields) {
      bundle.out[field] = {
        connections: new OutPort("connections", this)
      };
    }
  }
}
