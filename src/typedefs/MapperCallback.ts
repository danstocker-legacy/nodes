import {Node} from "../node/Node";

export type MapperCallback<I, O> = (next: I, i: string, nodes: Array<Node<any, I>>) => O;
