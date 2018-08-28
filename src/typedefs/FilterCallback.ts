import {Node} from "../Node";

export type FilterCallback<I> = (next: I, i: string, nodes: Array<Node<any, I>>) => boolean;
