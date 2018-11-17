import {IInPort, TErrorPorts, TEventPorts, TInPorts} from "../port";
import {ISink} from "./ISink";
import {Sink} from "./Sink";
import {TDynamicEventTypes} from "./TDynamicEventTypes";
import {TPortErrorTypes} from "./TPortErrorTypes";

export interface IDynamicSink extends ISink {
  in: TInPorts<{ [key: string]: any }>;
  svc: TEventPorts<Sink.EventTypes | TDynamicEventTypes> & TErrorPorts<TPortErrorTypes>;

  addPort(port: IInPort<any>): void;

  deletePort(port: IInPort<any>): void;
}
