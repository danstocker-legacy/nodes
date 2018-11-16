import {TEventPorts, TFailurePorts} from "../port";
import {IEventEmitter} from "./IEventEmitter";

/**
 * Adds input failure emitting capability to nodes.
 * Node classes where inputs might fail to be processed must implement this
 * interface, and mix relevant methods from FailureEmitter.
 */
export interface IFailureEmitter extends IEventEmitter {
  svc: TFailurePorts<any> & TEventPorts<any>;
}
