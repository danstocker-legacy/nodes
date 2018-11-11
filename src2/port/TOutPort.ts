import {IOutPort} from "./IOutPort";

/**
 * Defines an output port as having one of the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TOutPort<{foo: number, bar: boolean}>
 */
export type TOutPort<V> = IOutPort<V[keyof V]>;
