import {IDynamicPort} from "./IDynamicPort";
import {IInPort} from "./IInPort";

/**
 * Defines a set of dynamic input ports, where T specifies the value type of
 * all ports in the set.
 * @example
 * // a set of dynamic string input ports
 * const dynamicInPorts: TDynamicInPorts<string>
 */
export type TDynamicInPorts<T> = {
  [key: number]: IDynamicPort<T> & IInPort<T>
};
