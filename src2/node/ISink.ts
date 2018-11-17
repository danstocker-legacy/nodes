import {IInPort, TInPorts} from "../port";

export interface ISink {
  /** User defined input ports */
  in: TInPorts<any>;

  /**
   * Sends a value to the node though the specified input port, as part of
   * an optionally identified impulse.
   * @param port Receives input value.
   * @param value Input value passed to node.
   * @param tag Identifies impulse.
   */
  send(port: IInPort<any>, value: any, tag?: string): void;
}
