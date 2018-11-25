import {TBundle} from "./TBundle";
import {TInPort} from "./TInPort";

/**
 * Defines an input port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TInBundle<{foo: number, bar: boolean}>
 */
export type TInBundle<I> = TBundle<I, TInPort<I>>;
