import {TInPort} from "./TInPort";
import {TPorts} from "./TPorts";

/**
 * Defines an input port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TInPorts<{foo: number, bar: boolean}>
 */
export type TInPorts<I> = TPorts<I, TInPort<I>>;
