import {TEventPorts, TInPorts, TOutPorts} from "../port";

export type TPortEvents =
  "PORT_ADD" | "PORT_DELETE" |
  "PORT_CONNECT" | "PORT_DISCONNECT";

/**
 * A node has at least one input and one output port bundle, plus a service
 * port bundle. The service port bundle includes an event port, and
 * optionally, an error, a failure, and a command ports.
 */
export interface INode<I, O, E extends string = null> {
  /** User defined input ports */
  readonly in: TInPorts<I>;

  /** User defined output ports */
  readonly out: TOutPorts<O>;

  /** Service ports */
  readonly svc: TEventPorts<E | TPortEvents>;
}
