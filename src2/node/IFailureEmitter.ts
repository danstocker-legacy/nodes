import {TEventPorts, TFailurePorts} from "../port";
import {INode} from "./INode";
import {TNodeEventTypes} from "./TNodeEventTypes";

/**
 * Adds input failure emitting capability to nodes.
 * Node classes where inputs might fail to be processed must implement this
 * interface, and mix relevant methods from FailureEmitter.
 */
export interface IFailureEmitter extends INode {
  svc: TFailurePorts<any> & TEventPorts<TNodeEventTypes>;
}
