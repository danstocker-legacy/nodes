import {IOutPort} from "../port";
import {IDynamicSource} from "./IDynamicSource";

/**
 * Shared implementation for nodes that emit data through a variable
 * number of output ports.
 * Implements methods for addition and deletion of ports.
 * To be mixed into classes that implement IDynamicSource, IEventSource, and
 * IErrorSource.
 * @example
 * class DynamicSinkNode implements IDynamicSource, IEventSource, IErrorSource {
 *   public out: TOutPorts<...>
 *   public addPort = DynamicSource.addPort;
 *   public deletePort = DynamicSource.deletePort;
 *   ...
 *   constructor() {
 *     Source.init.call(this);
 *     DynamicSource.init.call(this);
 *     ...
 *   }
 * }
 * @see ISource
 * @see Source
 */
export namespace DynamicSource {
  /**
   * Adds the specified port to the output port bundle.
   * Raises exception when port already exists.
   * @param port Port to be added to outputs.
   * @param tag Identifies impulse.
   */
  export function addPort(
    this: IDynamicSource,
    port: IOutPort<any>,
    tag?: string
  ): void {
    const name = port.name;
    const ports = this.out;
    ports[name] = port;
  }

  /**
   * Deletes the specified port from the output port bundle.
   * Closes connection before deleting port.
   * Fails silently when port does not exist on output bundle.
   * @param port Port to be removed from outputs.
   * @param tag Identifies impulse.
   */
  export function deletePort(
    this: IDynamicSource,
    port: IOutPort<any>,
    tag?: string
  ): void {
    const name = port.name;
    const ports = this.out;
    if (port === ports[name]) {
      if (port.peers.size > 0) {
        port.disconnect();
      }
      delete ports[name];
    }
  }
}
