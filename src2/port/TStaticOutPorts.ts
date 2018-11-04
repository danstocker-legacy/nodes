import {THash} from "../utils";
import {IOutPort} from "./IOutPort";
import {TStaticPorts} from "./TStaticPorts";

/**
 * Defines a set of static output ports, where T specifies the value type for
 * each port, identified by name.
 * @example
 * // a set of one static numeric output port
 * const staticOutPorts: TStaticOutPorts<{"$": number}>
 */
export type TStaticOutPorts<T extends THash> = TStaticPorts<IOutPort<any>, T>;
