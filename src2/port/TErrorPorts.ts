import {IError} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Error port for the service port bundle.
 * Add to Node classes that throw errors.
 * @example
 * // in a Node subclass
 * svc: TEventPorts<"foo"> & TErrorPorts<"bar" | "baz">
 */
export type TErrorPorts<R extends string> = TOutPorts<{
  err: IError<R>
}>;
