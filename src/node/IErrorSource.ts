import {TErrorPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds error reporting capability to nodes.
 * Errors happen when the program's normal operation is fatally disrupted.
 * Node classes that need to report errors must implement this interface, and
 * mix relevant methods from ErrorSource.
 * @example
 * class ErrorSourceNode implements IErrorSource {
 *   ...
 * }
 * @see ErrorSource
 */
export interface IErrorSource extends IServiced {
  svc: TErrorPorts<any>;
}
