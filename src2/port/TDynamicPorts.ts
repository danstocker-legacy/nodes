import {IDynamicPort} from "./IDynamicPort";
import {IPort} from "./IPort";

/**
 * Describes a set of dynamic ports, where P specifies base port type.
 * @example
 * // a set of dynamic numeric input ports
 * const dynamicPorts: TDynamicPorts<IInPort<number>>
 */
export type TDynamicPorts<P extends IPort<any>> = {
  [key: number]: IDynamicPort<any> & P
};
