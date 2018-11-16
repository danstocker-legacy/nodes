import {OutPort} from "../port";
import {IFailureEmitter} from "./IFailureEmitter";

/**
 * Mixin with shared methods for node classes that implement IFailureEmitter.
 * @example
 * class MyNode implements IFailureEmitter {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     FailureEmitter.init.call(this);
 *   }
 * }
 */
export namespace FailureEmitter {
  export function init(this: IFailureEmitter): void {
    this.svc.fail = new OutPort("fail", this);
  }
}
