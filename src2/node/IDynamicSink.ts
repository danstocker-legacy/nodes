import {IInPort, TEventPorts, TInPorts, TPortEventTypes} from "../port";
import {ISink} from "./ISink";

export interface IDynamicSink extends ISink {
  in: TInPorts<{ [key: string]: any }>;
  svc: TEventPorts<TPortEventTypes | "PORT_ADD" | "PORT_DELETE">;

  addPort(port: IInPort<any>): void;

  deletePort(port: IInPort<any>): void;
}
