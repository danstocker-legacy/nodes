import {INode, InPort} from "../node/index";

export type MapperCallback<I, O> = (next: I, port?: InPort<I>, node?: INode) => O;
