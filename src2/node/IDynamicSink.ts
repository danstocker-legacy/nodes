import {IInPort, TErrorPorts, TEventPorts, TInPorts} from "../port";
import {ISink} from "./ISink";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TNodeEventTypes} from "./TNodeEventTypes";
import {TPortErrorTypes} from "./TPortErrorTypes";

export interface IDynamicSink extends ISink {
  in: TInPorts<{ [key: string]: any }>;
  svc: TEventPorts<TNodeEventTypes | TDynamicEventTypes> & TErrorPorts<TPortErrorTypes>;

  addPort(port: IInPort<any>): void;

  deletePort(port: IInPort<any>): void;
}
