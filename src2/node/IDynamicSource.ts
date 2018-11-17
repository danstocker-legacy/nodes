import {IOutPort, TErrorPorts, TEventPorts, TOutPorts} from "../port";
import {IErrorSource} from "./IErrorSource";
import {ISource} from "./ISource";
import {Source} from "./Source";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TPortErrorTypes} from "./TPortErrorTypes";

export interface IDynamicSource extends ISource, IErrorSource {
  out: TOutPorts<{ [key: string]: any }>;
  svc: TEventPorts<Source.EventTypes | TDynamicEventTypes> & TErrorPorts<TPortErrorTypes>;

  addPort(port: IOutPort<any>, tag?: string): void;

  deletePort(port: IOutPort<any>, tag?: string): void;
}
