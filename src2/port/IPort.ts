import {INode} from "../node";

export interface IPort<T> {
  name: string;
  node: INode;

  connect(peer: IPort<T>, tag?: string): void;

  send(value: T, tag?: string): void;
}
