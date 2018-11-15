import {TEventPorts} from "../port";
import {IServiced} from "./IServiced";
import {TNodeEventTypes} from "./TNodeEventTypes";

export interface IEvented extends IServiced {
  svc: TEventPorts<TNodeEventTypes>;
}
