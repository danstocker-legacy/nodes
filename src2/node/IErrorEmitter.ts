import {TErrorPorts, TEventPorts} from "../port";
import {IEventEmitter} from "./IEventEmitter";

/**
 * Adds error emitter capability to nodes.
 * Node classes that need to emit errors must implement this interface, and
 * mix relevant methods from ErrorEmitter.
 */
export interface IErrorEmitter extends IEventEmitter {
  svc: TErrorPorts<any> & TEventPorts<any>;
}
