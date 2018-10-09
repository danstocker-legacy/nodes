import {INode, InPort} from "../node/index";

export type FilterCallback<T> = (next: T, port?: InPort<T>, node?: INode) => boolean;
