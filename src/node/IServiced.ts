import {TOutPorts} from "../port";

/**
 * Defines a serviced node.
 * Serviced nodes emit service information through output ports in the "svc"
 * port bundle.
 * Most atomic nodes should implement this interface, as it is required by
 * emitting events, or reporting errors and failed inputs.
 * Usually, node classes implement this interface indirectly, through
 * IEventSource, IErrorSource, or IFailedInputSource.
 * @example
 * class ServicedNode implement IServiced {
 *   ...
 * }
 * @see Serviced
 */
export interface IServiced {
  /** Service ports */
  svc: TOutPorts<any>;
}
