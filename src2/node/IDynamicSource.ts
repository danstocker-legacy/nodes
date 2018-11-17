import {IOutPort, TOutPorts} from "../port";
import {ISource} from "./ISource";

export interface IDynamicSource extends ISource {
  out: TOutPorts<{ [key: string]: any }>;

  addPort(port: IOutPort<any>, tag?: string): void;

  deletePort(port: IOutPort<any>, tag?: string): void;
}
