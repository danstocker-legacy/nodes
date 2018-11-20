import {IErrorSource, IEventSource, ISink} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

/**
 * Implements the input port.
 * Connects, disconnects nodes, and sends data.
 * Assigned node must implement the IEventSource and IErrorSource interfaces.
 */
export class InPort<V> extends Port<V> implements IInPort<V> {
  /**
   * Node the port is assigned to.
   * Must be sink node that is capable of emitting events.
   */
  public node: ISink & IEventSource & IErrorSource;

  /**
   * Remote port the current port is connecting to.
   * When this is undefined, the port is not connected.
   */
  public peer: IOutPort<V>;

  /**
   * @param name Identifies port in the context of its assigned node.
   * @param node Node the port is assigned to.
   */
  constructor(name: string, node: ISink & IEventSource & IErrorSource) {
    super(name, node);
  }

  /**
   * Connects port to the specified remote output port.
   * Emits error when port is already connected, except when it's
   * already connected to the specified peer.
   * Emits event after connecting.
   * @param peer Remote output port.
   * @param tag Identifies impulse.
   */
  public connect(peer: IOutPort<V>, tag?: string): void {
    if (!this.peer) {
      this.peer = peer;
      peer.connect(this, tag);
      this.node.svc.evt.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_CONNECT"
      }, tag);
    } else if (peer !== this.peer) {
      this.node.svc.err.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_ALREADY_CONNECTED"
      }, tag);
    }
  }

  /**
   * Disconnects port from peer.
   * Emits event after disconnecting.
   * @param tag Identifies impulse.
   */
  public disconnect(tag?: string): void {
    const peer = this.peer;
    if (peer) {
      this.peer = undefined;
      peer.disconnect(this, tag);
      this.node.svc.evt.send({
        payload: {
          peer,
          port: this
        },
        type: "PORT_DISCONNECT"
      }, tag);
    }
  }

  /**
   * Sends value to port.
   * Forwards value to assigned node.
   * @param value Value to be sent to port.
   * @param tag Identifies impulse.
   */
  public send(value: V, tag?: string): void {
    this.node.send(this, value, tag);
  }
}
