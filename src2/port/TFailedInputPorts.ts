import {IMuxed} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Shorthand for adding a port for communicating failed inputs to the
 * service port bundle of a node class.
 * Use in node classes where inputs might fail to be processed.
 * @example
 * class FailedInputSourceNode implements IFailedInputSource {
 *   svc: TFailedInputPorts<{foo: number, bar: boolean}>
 *   ...
 *   constructor() {
 *     Serviced.init.call(this);
 *     FailedInputSource.init.call(this);
 *   }
 *   ...
 *   public send(port: IInPort<any>, value: any, tag?: string) {
 *     ...
 *     this.svc.fail.send({name: port.name, val: value}, tag);
 *   }
 * }
 */
export type TFailedInputPorts<T> = TOutPorts<{
  fail: IMuxed<T>
}>;
