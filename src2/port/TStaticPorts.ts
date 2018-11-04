import {THash} from "../utils";
import {IPort} from "./IPort";
import {IStaticPort} from "./IStaticPort";

/**
 * Describes a set of static ports, where P specifies base port type and T
 * specifies the value type for each port, identified by name.
 * @example
 * // a set of one static numeric input port "$"
 * const staticPorts: TStaticPorts<IInPort<any>, {"$": number}>
 */
export type TStaticPorts<P extends IPort<any>, T extends THash> = {
  [K in keyof T]: IStaticPort<T[K]> & P & IPort<T[K]>
};
