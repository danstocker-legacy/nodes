import {IAtomicNode} from "../node";

/**
 * Describes an event value emitted by nodes though the "event" output port.
 * @example
 * const nodeEvent = new IEvent("port-add", node, {port});
 */
export interface IEvent<T> {
  readonly type: string;
  readonly node: IAtomicNode;
  readonly payload: T;
}
