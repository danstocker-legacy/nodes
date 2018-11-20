import {TPort} from "./TPort";

/**
 * Defines a port bundle as having the name / type pairs of the specified
 * interface (I). Also defines the type of all ports (P) included.
 * Mostly used internally.
 * @example
 * const port: TPorts<{foo: number, bar: boolean}, TInPort<{foo: number, bar: boolean}>>
 */
export type TPorts<I, P extends TPort<I>> = {
  [K in keyof I]: P
};
