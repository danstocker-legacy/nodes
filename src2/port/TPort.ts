import {INode} from "../node";
import {IPort} from "./IPort";

export type TPort<N extends INode<any, any>, V> = IPort<N, V[keyof V]>;
