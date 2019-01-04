import {IInPort} from "../port";
import {ISink} from "./ISink";

/**
 * Defines an atomic sink node.
 * All atomic nodes that receive data should implement this interface.
 */
export interface IAtomicSink extends ISink {
  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send(port: IInPort<any>, value: any, tag?: string): void;
}
