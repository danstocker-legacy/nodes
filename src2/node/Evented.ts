import {OutPort} from "../port";

export namespace Evented {
  export function init() {
    this.svc.evt = new OutPort("evt", this);
  }
}
