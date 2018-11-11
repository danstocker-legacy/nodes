import {IMuxed} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Failed inputs port for the service port bundle.
 * Add to node classes where inputs might fail to be processed.
 * @example
 * // in a Node subclass
 * svc: TEventPorts<"foo"> & TFailedPorts<{foo: number, bar: boolean}>
 */
export type TFailedPorts<T> = TOutPorts<{
  fail: IMuxed<T>
}>;
