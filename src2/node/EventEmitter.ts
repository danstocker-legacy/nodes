import {OutPort} from "../port";
import {IEventEmitter} from "./IEventEmitter";

/**
 * Mixin with shared methods for node classes that implement IEventEmitter.
 * @example
 * class MyNode implements IEventEmitter {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     EventEmitter.init.call(this);
 *   }
 * }
 */
export namespace EventEmitter {
  export function init(this: IEventEmitter): void {
    this.svc.evt = new OutPort("evt", this);
  }
}