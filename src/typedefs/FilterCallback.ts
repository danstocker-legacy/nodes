import {INode} from "../node";

export type FilterCallback<T> = (next: T, i: string, node: INode) => boolean;
