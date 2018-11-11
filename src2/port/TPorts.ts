import {INode} from "../node";
import {TPort} from "./TPort";

export type TPorts<V, N extends INode<any, any>, P extends TPort<N, V>> = {
  [K in keyof V]: P
};
