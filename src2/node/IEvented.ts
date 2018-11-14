import {TEventPorts} from "../port";
import {IServiced, TPortEvents} from "./IServiced";

export interface IEvented extends IServiced {
  svc: TEventPorts<TPortEvents>;
}
