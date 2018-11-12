import {TNode} from "../node";
import {IPort} from "./IPort";

/**
 * Defines a port as having one of the name / type pairs of the specified
 * interface (I).
 * @example
 * const port: TPort<TNode<any, any>, {foo: number, bar: boolean}>;
 */
export type TPort<N extends TNode<any, any>, I> = IPort<N, I[keyof I]>;
