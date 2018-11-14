import {TOutPorts} from "../port";

export interface IServiced {
  /** Service ports */
  svc: TOutPorts<any>;
}
