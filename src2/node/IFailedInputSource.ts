import {TFailedInputPorts} from "../port";
import {IServiced} from "./IServiced";

/**
 * Adds input failure reporting capability to nodes.
 * Input failure happens when the node is unable to process its input due to
 * a (possibly) transient cause. Input failure is reported by sending the
 * multiplexed input to the input failure port (`svc.fail`).
 * Node classes where inputs might fail to be processed must implement this
 * interface, and mix relevant methods from FailedInputSource.
 * @example
 * class FailedInputSourceNode implements IFailedInputSource {
 *   ...
 * }
 * @see FailedInputSource
 */
export interface IFailedInputSource extends IServiced {
  svc: TFailedInputPorts<any>;
}
