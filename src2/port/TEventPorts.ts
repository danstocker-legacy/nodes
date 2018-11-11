import {IEvent} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Event port for the service port bundle.
 * Included in INode#svc.
 * @example
 * // usage:
 * node.svc.evt.connect(new Listener((value, tag) => console.log(value, tag)));
 * // will log events from the specified node to console
 */
export type TEventPorts<E extends string> = TOutPorts<{
  evt: IEvent<E>
}>;
