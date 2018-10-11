import {INode, InPort} from "../../node";

export type FilterCallback<T> = (next: T, port?: InPort<T>, node?: INode) => boolean;
