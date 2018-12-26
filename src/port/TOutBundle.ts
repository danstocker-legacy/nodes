import {IOutPort} from "./IOutPort";

/**
 * Defines an output port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TOutBundle<{foo: number, bar: boolean}>
 */
export type TOutBundle<I> = {
  [K in keyof I]: IOutPort<I[K]>
};
