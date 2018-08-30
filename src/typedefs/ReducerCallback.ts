import {INode, Port} from "../node";

export type ReducerCallback<I, O> = (result: O, next: I, i: Port<I>, node: INode) => O;
