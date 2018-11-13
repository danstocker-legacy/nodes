import {TNode} from "../node";

/**
 * Describes a generic port.
 * Generic ports may be assigned to any node type (N) and can take any type of
 * value (V).
 * TODO: Add S as name parameter? (S extends string)
 * @see IInPort
 * @see IOutPort
 */
export interface IPort<N extends TNode, V> {
  name: string;
  node: N;

  connect(peer: IPort<TNode, V>, tag?: string): void;

  send(value: V, tag?: string): void;
}
