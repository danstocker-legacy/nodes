import {TNode} from "../node";
import {IPort} from "./IPort";

/**
 * Defines a port as having one of the name / type pairs of the specified
 * interface (I).
 * @example
 * const port: TPort<TNode, {foo: number, bar: boolean}>;
 */
export type TPort<N extends TNode, I> = IPort<N, I[keyof I]>;
