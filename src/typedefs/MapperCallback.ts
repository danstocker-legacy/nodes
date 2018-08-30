import {INode} from "../node";

export type MapperCallback<I, O> = (next: I, i: string, node: INode) => O;
