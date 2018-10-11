import {INode, InPort} from "../../node";

export type MapCallback<I, O> = (next: I, port?: InPort<I>, node?: INode) => O;
