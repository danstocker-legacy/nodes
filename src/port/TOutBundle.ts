import {TBundle} from "./TBundle";
import {TOutPort} from "./TOutPort";

/**
 * Defines an output port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TOutBundle<{foo: number, bar: boolean}>
 */
export type TOutBundle<I> = TBundle<I, TOutPort<I>>;
