import {NodeBase} from "./NodeBase";

/**
 * Blueprint for ports.
 */
export interface IPort<T> {
  readonly node: NodeBase;
  readonly permanent: boolean;

  send(value: T, tag?: string): void;

  connect(peer: IPort<T>): void;

  disconnect(peer?: IPort<T>): void;
}
