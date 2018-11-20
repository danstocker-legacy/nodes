import {IInPort} from "./IInPort";

/**
 * Defines an input port as having one of the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TInPort<{foo: number, bar: boolean}>
 */
export type TInPort<I> = IInPort<I[keyof I]>;
