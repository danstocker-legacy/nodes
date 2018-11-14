import {OutPort} from "../port";
import {IEvented} from "./IEvented";

/**
 * Implements shared methods for classes that implement IEvented.
 */
export namespace Evented {
  export function init(this: IEvented) {
    this.svc.evt = new OutPort("evt", this);
  }
}
