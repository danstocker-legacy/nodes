import {INode, InPort} from "../node";

export type MapperCallback<I, O> = (next: I, port: InPort<I>, node: INode) => O;
