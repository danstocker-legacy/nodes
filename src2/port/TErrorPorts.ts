import {IError} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Shorthand for adding error port of given error types to the service port
 * bundle of a node class.
 * Use in node classes that report errors.
 * @example
 * class ErrorSourceNode implements IErrorSource {
 *   svc: TErrorPorts<"foo" | "bar">
 *   ...
 *   constructor() {
 *     Serviced.init.call(this);
 *     ErrorSource.init.call(this);
 *   }
 *   ...
 *   public foo() {
 *     ...
 *     this.svc.err.send({type: "foo", payload: null});
 *   }
 * }
 */
export type TErrorPorts<R extends string> = TOutPorts<{
  err: IError<R>
}>;
