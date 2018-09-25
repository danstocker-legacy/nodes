import {NodeBase} from "./NodeBase";

/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  readonly node: NodeBase;

  send(value: T, tag?: string): void;

  connect(peer: IPort<T>): void;

  disconnect(peer?: IPort<T>): void;
}
