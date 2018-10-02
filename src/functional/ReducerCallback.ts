import {INode, InPort} from "../node";

export type ReducerCallback<I, O> = (current: O, next: I, port: InPort<I>, node: INode) => O;
