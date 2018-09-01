import {INode} from "./INode";

export interface IPort<T> {
  readonly node: INode;
  peer: IPort<T>;

  send(value: T): void;
}
