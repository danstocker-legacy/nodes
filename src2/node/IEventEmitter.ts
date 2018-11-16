import {TEventPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds event emitting capability to nodes.
 * Node classes that need to emit events must implement this interface, and
 * mix relevant methods from EventEmitter.
 */
export interface IEventEmitter extends IServiced {
  svc: TEventPorts<any>;
}
