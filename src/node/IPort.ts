import {INode} from "./INode";

/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  readonly node: INode;
  peer: IPort<T>;

  send(value: T, ts?: number): void;
}
