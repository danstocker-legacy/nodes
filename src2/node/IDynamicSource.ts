import {IOutPort, TEventPorts, TOutPorts, TPortEventTypes} from "../port";
import {ISource} from "./ISource";

export interface IDynamicSource extends ISource {
  out: TOutPorts<{ [key: string]: any }>;
  svc: TEventPorts<TPortEventTypes | "PORT_ADD" | "PORT_DELETE">;

  addPort(port: IOutPort<any>, tag?: string): void;

  deletePort(port: IOutPort<any>, tag?: string): void;
}
