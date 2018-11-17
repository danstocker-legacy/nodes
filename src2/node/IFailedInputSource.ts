import {TEventPorts, TFailurePorts} from "../port";
import {IEventSource} from "./IEventSource";

/**
 * Adds input failure emitting capability to nodes.
 * Node classes where inputs might fail to be processed must implement this
 * interface, and mix relevant methods from FailedInputSource.
 */
export interface IFailedInputSource extends IEventSource {
  svc: TFailurePorts<any> & TEventPorts<any>;
}
