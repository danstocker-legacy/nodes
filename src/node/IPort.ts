import {Node} from "./Node";

/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  readonly node: Node;

  send(value: T, tag?: string): void;

  connect(peer: IPort<T>): void;

  disconnect(peer?: IPort<T>): void;
}
