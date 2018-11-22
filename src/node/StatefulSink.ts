import {OutPort, TMetaBundles} from "../port";
import {IStatefulSink} from "./IStatefulSink";

export namespace StatefulSink {
  export function init(this: IStatefulSink, fields: Array<string>) {
    const bundle = this.change;
    bundle.in = {} as TMetaBundles<any>;
    for (const field of fields) {
      bundle.in[field] = {
        connections: new OutPort("connections", this)
      };
    }
  }
}
