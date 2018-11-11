import {INode} from "../node";
import {IInPort} from "./IInPort";
import {IPort} from "./IPort";

export interface IOutPort<T> extends IPort<INode<any, any>, T> {
  out: true;
  peers: Set<IInPort<T>>;

  connect(peer: IInPort<T>, tag?: string): void;

  disconnect(peer?: IInPort<T>, tag?: string): void;
}
