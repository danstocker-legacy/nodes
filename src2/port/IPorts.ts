import {INode} from "../node";
import {TPort} from "./TPort";
import {TPorts} from "./TPorts";

/**
 * Defines class that manages a set of ports.
 */
export interface IPorts<T, N extends INode<any, any>, P extends TPort<N, T>> {
  bundle: TPorts<T, N, P>;

  addPort(port: P): void;

  deletePort(port: P): void;
}
