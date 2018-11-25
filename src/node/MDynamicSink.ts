import {IInPort} from "../port";
import {IDynamicSink} from "./IDynamicSink";

/**
 * Shared implementation for nodes that receive data through a variable
 * number of input ports.
 * Implements methods for addition and deletion of ports.
 * To be mixed into classes that implement IDynamicSink.
 * @example
 * class DynamicSinkNode implements IDynamicSink, IEventSource, IErrorSource {
 *   public in: TInBundle<...>
 *   public addPort = MDynamicSink.addPort;
 *   public deletePort = MDynamicSink.deletePort;
 *   ...
 *   constructor() {
 *     MSink.init.call(this);
 *     MDynamicSink.init.call(this);
 *     ...
 *   }
 * }
 * @see ISink
 * @see MSink
 */
export namespace MDynamicSink {
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
    this: IDynamicSink,
    port: IInPort<any>,
    tag?: string
  ): void {
    const name = port.name;
    const ports = this.in;
    ports[name] = port;
  }

  /**
   * Deletes the specified port from the input port bundle.
   * Closes connection before deleting port.
   * Fails silently when port does not exist on input bundle.
   * @param port Port to be removed from inputs.
   * @param tag Identifies impulse.
   */
  export function deletePort(
    this: IDynamicSink,
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
    }
  }
}
