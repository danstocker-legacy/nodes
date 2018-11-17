import {TFailurePorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds input failure emitting capability to nodes.
 * Node classes where inputs might fail to be processed must implement this
 * interface, and mix relevant methods from FailedInputSource.
 */
export interface IFailedInputSource extends IServiced {
  svc: TFailurePorts<any>;
}
