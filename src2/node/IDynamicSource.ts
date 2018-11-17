import {IOutPort, TErrorPorts, TEventPorts, TOutPorts} from "../port";
import {IErrorSource} from "./IErrorSource";
import {ISource} from "./ISource";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TNodeEventTypes} from "./TNodeEventTypes";
import {TPortErrorTypes} from "./TPortErrorTypes";

export interface IDynamicSource extends ISource, IErrorSource {
  out: TOutPorts<{ [key: string]: any }>;
  svc: TEventPorts<TNodeEventTypes | TDynamicEventTypes> & TErrorPorts<TPortErrorTypes>;

  addPort(port: IOutPort<any>, tag?: string): void;

  deletePort(port: IOutPort<any>, tag?: string): void;
}
