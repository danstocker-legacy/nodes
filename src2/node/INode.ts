import {TInPorts, TOutPorts} from "../port";

/**
 * A node has at least one input and one output port bundle, plus a service
 * port bundle. The service port bundle includes an event port, and user
 * defined ports.
 */
export interface INode<I, O> {
  /** User defined input ports */
  readonly in: TInPorts<I>;

  /** User defined output ports */
  readonly out: TOutPorts<O>;
}
