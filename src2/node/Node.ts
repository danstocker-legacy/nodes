import {TEventPorts, TPortEventTypes} from "../port";
import {Evented} from "./Evented";
import {INode} from "./INode";
import {Serviced} from "./Serviced";

/**
 * Base class for all nodes.
 * All nodes have a service port bundle, (`svc` property) containing at
 * least an event port (`svc.evt`).
 */
export class Node implements INode {
  public svc: TEventPorts<TPortEventTypes>;

  constructor() {
    Serviced.init.call(this);
    Evented.init.call(this);
  }
}
