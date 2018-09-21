import {INode} from "./INode";

/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  readonly node: INode;

  send(value: T, tag?: string): void;

  connect(peer: IPort<T>): void;

  disconnect(peer?: IPort<T>): void;
}
