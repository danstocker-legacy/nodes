import {IInPort, TInPorts} from "../port";
import {ISink} from "./ISink";

export interface IDynamicSink extends ISink {
  in: TInPorts<{ [key: string]: any }>;

  addPort(port: IInPort<any>): void;

  deletePort(port: IInPort<any>): void;
}
