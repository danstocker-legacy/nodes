import {IAtomicNode} from "../node";

export interface IPort<T> {
  name: string;
  node: IAtomicNode<any>;

  connect(peer: IPort<T>, tag?: string): void;

  send(value: T, tag?: string): void;
}
