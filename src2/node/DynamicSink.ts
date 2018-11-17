import {IInPort} from "../port";
import {IDynamicSink} from "./IDynamicSink";
import {IErrorSource} from "./IErrorSource";
import {IEventSource} from "./IEventSource";

/**
 * Shared implementation for nodes that receive data through a variable
 * number of input ports.
 * Implements methods for addition and deletion of ports.
 * To be mixed into classes that implement IDynamicSink, IEventSource, and
 * IErrorSource.
 * @example
 * class DynamicSinkNode implements IDynamicSink, IEventSource, IErrorSource {
 *   public in: TInPorts<...>
 *   public svc:
 *     TEventSource<DynamicSink.TEventTypes> &
 *     TErrorSource<DynamicSink.TErrorTypes>
 *   public addPort = DynamicSink.addPort;
 *   public deletePort = DynamicSink.deletePort;
 *   ...
 *   constructor() {
 *     Serviced.init.call(this);
 *     EventSource.init.call(this);
 *     ErrorSource.init.call(this);
 *     Sink.init.call(this);
 *     DynamicSink.init.call(this);
 *     ...
 *   }
 * }
 * @see ISink
 * @see Sink
 */
export namespace DynamicSink {
  /**
   * Event types specific to dynamic sink nodes.
   */
  export type TEventTypes = "PORT_ADD" | "PORT_DELETE";

  /**
   * Error types specific to dynamic sink nodes.
   */
  export type TErrorTypes = "PORT_ADD_FAILURE";

  /**
   * Adds the specified port to the input port bundle.
   * Raises exception when port already exists.
   * @param port Port to be added to inputs.
   * @param tag Identifies impulse.
   */
  export function addPort(
    this: IDynamicSink & IEventSource & IErrorSource,
    port: IInPort<any>,
    tag?: string
  ): void {
    const name = port.name;
    const ports = this.in;
    if (ports[name]) {
      this.svc.err.send({
        payload: {
          node: this,
          port
        },
        type: "PORT_ADD_FAILURE"
      }, tag);
    }
    ports[name] = port;
    this.svc.evt.send({
      payload: {
        node: this,
        port
      },
      type: "PORT_ADD"
    }, tag);
  }

  /**
   * Deletes the specified port from the input port bundle.
   * Closes connection before deleting port.
   * Fails silently when port does not exist on input bundle.
   * @param port Port to be removed from inputs.
   * @param tag Identifies impulse.
   */
  export function deletePort(
    this: IDynamicSink & IEventSource,
    port: IInPort<any>,
    tag?: string
  ): void {
    const name = port.name;
    const ports = this.in;
    if (port === ports[name]) {
      if (port.peer) {
        port.disconnect();
      }
      delete ports[name];
      this.svc.evt.send({
        payload: {
          node: this,
          port
        },
        type: "PORT_DELETE"
      }, tag);
    }
  }
}
