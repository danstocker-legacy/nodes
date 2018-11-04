import {NodeEvent} from "../utils";
import {IOutPort} from "./IOutPort";
import {TDynamicPorts} from "./TDynamicPorts";
import {TStaticPorts} from "./TStaticPorts";

/**
 * Defines a set of dynamic output ports, where T specifies the value type of
 * all ports in the set. Apart from the dynamic, numerically-indexed ports,
 * the set includes an "event" port, through which dynamic port changes may
 * be communicated.
 * @example
 * // a set of dynamic string output ports
 * const dynamicOutPorts: TDynamicOutPorts<string>
 */
export type TDynamicOutPorts<T> =
  TDynamicPorts<IOutPort<T>> &
  TStaticPorts<IOutPort<T>, {
    event: NodeEvent
  }>;
