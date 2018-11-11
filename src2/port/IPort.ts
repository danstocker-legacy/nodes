import {INode} from "../node";

export interface IPort<N extends INode<any, any>, T> {
  name: string;
  node: N;

  connect(peer: IPort<INode<any, any>, T>, tag?: string): void;

  send(value: T, tag?: string): void;
}
