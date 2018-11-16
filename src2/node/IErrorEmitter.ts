import {TErrorPorts, TEventPorts} from "../port";
import {INode} from "./INode";
import {TNodeEventTypes} from "./TNodeEventTypes";

/**
 * Adds error emitter capability to nodes.
 * Node classes that need to emit errors must implement this interface, and
 * mix relevant methods from ErrorEmitter.
 */
export interface IErrorEmitter extends INode {
  svc: TErrorPorts<any> & TEventPorts<TNodeEventTypes>;
}
