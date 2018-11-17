import {OutPort} from "../port";
import {IEventSource} from "./IEventSource";

/**
 * Shared implementation for nodes that emit events.
 * Adds "evt" (event) output port to the host's "svc" (service) port bundle.
 * To be mixed into classes that implement IEventSource.
 * @example
 * class EventSourceNode implements IEventSource {
 *   ...
 *   constructor() {
 *     ...
 *     Serviced.init.call(this);
 *     EventSource.init.call(this);
 *   }
 * }
 * @see IEventSource
 */
export namespace EventSource {
  /**
   * Adds "evt" port to service port bundle.
   * Service port bundle is expected to be already initialized. (By Serviced
   * mixin.)
   * @see Serviced
   */
  export function init(this: IEventSource): void {
    this.svc.evt = new OutPort("evt", this);
  }
}
