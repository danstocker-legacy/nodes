import {INode, InPort} from "../node/index";

export type ReducerCallback<I, O> = (current: O, next: I, port?: InPort<I>, node?: INode) => O;
