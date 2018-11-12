import {IEvent} from "../utils";
import {IServiced} from "./IServiced";
import {ISink} from "./ISink";
import {ISource} from "./ISource";

export type TPortEvents =
  "PORT_ADD" | "PORT_DELETE" |
  "PORT_CONNECT" | "PORT_DISCONNECT";

/**
 * A node has at least one input and one output port bundle, plus a service
 * port bundle. The service port bundle includes an event port, and
 * optionally, an error, a failure, and a command ports.
 * @deprecated Use a combination of ISink, ISource, IServiced
 */
export interface INode<I, O, E extends string = null>
  extends ISink<I>, ISource<O>, IServiced<{ evt: IEvent<E | TPortEvents> }> {
}
