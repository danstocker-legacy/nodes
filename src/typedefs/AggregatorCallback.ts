import {Node} from "../node/Node";

export type AggregatorCallback<I, O> = (result: O, next: I, i: string, nodes: Array<Node<any, I>>) => O;
