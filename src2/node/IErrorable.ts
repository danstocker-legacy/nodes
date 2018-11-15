import {TErrorPorts, TEventPorts} from "../port";
import {INode} from "./INode";
import {TNodeEventTypes} from "./TNodeEventTypes";

export interface IErrorable extends INode {
  svc: TErrorPorts<any> & TEventPorts<TNodeEventTypes>;
}
