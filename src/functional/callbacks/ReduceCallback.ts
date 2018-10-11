import {INode, InPort} from "../../node";

export type ReduceCallback<I, O> = (current: O, next: I, port?: InPort<I>, node?: INode) => O;
