import {IInPort} from "./IInPort";
import {TDynamicPorts} from "./TDynamicPorts";

/**
 * Defines a set of dynamic input ports, where T specifies the value type of
 * all ports in the set.
 * @example
 * // a set of dynamic string input ports
 * const dynamicInPorts: TDynamicInPorts<string>
 */
export type TDynamicInPorts<T> = TDynamicPorts<IInPort<T>>;
