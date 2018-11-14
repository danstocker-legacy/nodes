import {TEventPorts, TPortEventTypes} from "../port";
import {IEvented} from "./IEvented";

export interface INode extends IEvented {
  svc: TEventPorts<TPortEventTypes>;
}
