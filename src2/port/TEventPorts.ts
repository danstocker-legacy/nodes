import {IEvent} from "../utils";
import {TOutPorts} from "./TOutPorts";

/**
 * Shorthand for adding event port of given event types to the service port
 * bundle of a node class.
 * Use in node classes that emit events.
 * @example
 * class EventSourceNode implements IEventSource {
 *   svc: TEventPorts<"foo" | "bar">
 *   ...
 *   constructor() {
 *     Serviced.init.call(this);
 *     EventSource.init.call(this);
 *   }
 *   ...
 *   public foo() {
 *     ...
 *     this.svc.evt.send({type: "foo", payload: null});
 *   }
 * }
 */
export type TEventPorts<E extends string> = TOutPorts<{
  evt: IEvent<E>
}>;
