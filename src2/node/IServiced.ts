import {TOutPorts} from "../port";

export interface IServiced<T> {
  /** Service ports */
  readonly svc: TOutPorts<T>;
}
