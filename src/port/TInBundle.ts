import {IInPort} from "./IInPort";

/**
 * Defines an input port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TInBundle<{foo: number, bar: boolean}>
 */
export type TInBundle<I> = {
  [K in keyof I]: IInPort<I[K]>
};
