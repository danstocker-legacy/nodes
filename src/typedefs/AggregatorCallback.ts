import {INode, Port} from "../node";

export type AggregatorCallback<I, O> = (result: O, next: I, i: Port<I>, node: INode) => O;
