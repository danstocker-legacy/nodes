import {TOutPorts} from "../port";

// TODO: Break out?
export type TPortEvents =
  "PORT_ADD" | "PORT_DELETE" |
  "PORT_CONNECT" | "PORT_DISCONNECT";

export interface IServiced<T> {
  /** Service ports */
  readonly svc: TOutPorts<T>;
}
