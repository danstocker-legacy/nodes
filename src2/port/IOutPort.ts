import {IInPort} from "./IInPort";
import {IPort} from "./IPort";

/**
 * Describes an output port.
 * Output ports may ba assigned to any node type. (Atomic & composite.)
 */
export interface IOutPort<V> extends IPort<V> {
  peers: Set<IInPort<V>>;

  connect(peer: IInPort<V>, tag?: string): void;

  disconnect(peer?: IInPort<V>, tag?: string): void;
}
