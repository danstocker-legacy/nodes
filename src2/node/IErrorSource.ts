import {TErrorPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds error emitter capability to nodes.
 * Node classes that need to emit errors must implement this interface, and
 * mix relevant methods from ErrorSource.
 */
export interface IErrorSource extends IServiced {
  svc: TErrorPorts<any>;
}
