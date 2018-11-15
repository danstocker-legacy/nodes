import {IInPort, TEventPorts, TInPorts} from "../port";
import {ISink} from "./ISink";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TNodeEventTypes} from "./TNodeEventTypes";

export interface IDynamicSink extends ISink {
  in: TInPorts<{ [key: string]: any }>;
  svc: TEventPorts<TNodeEventTypes | TDynamicEventTypes>;

  addPort(port: IInPort<any>): void;

  deletePort(port: IInPort<any>): void;
}
