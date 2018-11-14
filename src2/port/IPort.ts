import {INode} from "../node";

/**
 * Describes a generic port.
 * Generic ports may be assigned to any node type (N) and can take any type of
 * value (V).
 * TODO: Add S as name parameter? (S extends string)
 * @see IInPort
 * @see IOutPort
 */
export interface IPort<V> {
  name: string;
  node: INode;

  connect(peer: IPort<V>, tag?: string): void;

  send(value: V, tag?: string): void;
}
