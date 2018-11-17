import {OutPort} from "../port";
import {IEventSource} from "./IEventSource";

/**
 * Mixin with shared methods for node classes that implement IEventSource.
 * @example
 * class MyNode implements IEventSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     EventSource.init.call(this);
 *   }
 * }
 */
export namespace EventSource {
  export function init(this: IEventSource): void {
    this.svc.evt = new OutPort("evt", this);
  }
}
