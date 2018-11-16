import {OutPort} from "../port";
import {IErrorEmitter} from "./IErrorEmitter";

/**
 * Mixin with shared methods for node classes that implement IErrorEmitter.
 * @example
 * class MyNode implements IErrorEmitter {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     ErrorEmitter.init.call(this);
 *   }
 * }
 */
export namespace ErrorEmitter {
  export function init(this: IErrorEmitter): void {
    this.svc.err = new OutPort("err", this);
  }
}
