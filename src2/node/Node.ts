import {TEventPorts} from "../port";
import {EventEmitter} from "./EventEmitter";
import {INode} from "./INode";
import {Serviced} from "./Serviced";
import {TNodeEventTypes} from "./TNodeEventTypes";

/**
 * Base class for all nodes.
 * All nodes have a service port bundle, (`svc` property) containing at
 * least an event port (`svc.evt`).
 */
export class Node implements INode {
  public svc: TEventPorts<TNodeEventTypes>;

  constructor() {
    Serviced.init.call(this);
    EventEmitter.init.call(this);
  }
}
