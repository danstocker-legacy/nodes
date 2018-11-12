import {IInPort, TInPorts} from "../port";

export interface ISink<T> {
  /** User defined input ports */
  readonly in: TInPorts<T>;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send(port: IInPort<T[keyof T]>, value: T[keyof T], tag?: string): void;
}
