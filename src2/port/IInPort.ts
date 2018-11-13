import {ISink} from "../node";
import {IOutPort} from "./IOutPort";
import {IPort} from "./IPort";

/**
 * Describes an input port.
 * Input ports may only be assigned to atomic nodes.
 */
export interface IInPort<V> extends IPort<ISink, V> {
  in: true;
  peer: IOutPort<V>;

  connect(peer: IOutPort<V>, tag?: string): void;

  disconnect(tag?: string): void;
}
