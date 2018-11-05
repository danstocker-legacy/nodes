import {THash} from "../utils";
import {IInPort} from "./IInPort";
import {IStaticPort} from "./IStaticPort";

/**
 * Defines a set of static input ports, where T specifies the value type for
 * each port, identified by name.
 * @example
 * // a set of one static numeric input port "$"
 * const staticInPorts: TStaticInPorts<{"$": number}>
 */
export type TStaticInPorts<T extends THash> = {
  [K in keyof T]: IStaticPort<T[K]> & IInPort<T[K]>
};