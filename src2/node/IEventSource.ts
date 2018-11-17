import {TEventPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds event emitting capability to nodes.
 * Node classes that need to emit events must implement this interface, and
 * mix relevant methods from EventSource.
 * @example
 * class EventSourceNode implements IEventSource {
 *   ...
 * }
 * @see EventSource
 */
export interface IEventSource extends IServiced {
  svc: TEventPorts<any>;
}
