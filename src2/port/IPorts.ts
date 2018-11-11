import {INode} from "../node";
import {TPort} from "./TPort";
import {TPorts} from "./TPorts";

export interface IPorts<V, N extends INode<any, any>, P extends TPort<N, V>> {
  bundle: TPorts<V, N, P>;

  addPort(port: P): void;

  deletePort(port: P): void;
}
