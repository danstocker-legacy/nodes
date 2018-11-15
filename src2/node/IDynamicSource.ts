import {IOutPort, TEventPorts, TOutPorts} from "../port";
import {ISource} from "./ISource";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TNodeEventTypes} from "./TNodeEventTypes";

export interface IDynamicSource extends ISource {
  out: TOutPorts<{ [key: string]: any }>;
  svc: TEventPorts<TNodeEventTypes | TDynamicEventTypes>;

  addPort(port: IOutPort<any>, tag?: string): void;

  deletePort(port: IOutPort<any>, tag?: string): void;
}
