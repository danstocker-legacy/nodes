import {TEventPorts, TPortEventTypes} from "../port";
import {IServiced} from "./IServiced";

export interface IEvented extends IServiced {
  svc: TEventPorts<TPortEventTypes>;
}
