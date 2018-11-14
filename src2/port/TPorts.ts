import {TPort} from "./TPort";

/**
 * Defines a port bundle as having the name / type pairs of the specified
 * interface (I). Also defines what node type the bundle belongs to (N), as
 * well as the type of the ports (P) that are included.
 * @example
 * const port: TPorts<{foo: number, bar: boolean}, >
 */
export type TPorts<I, P extends TPort<I>> = {
  [K in keyof I]: P
};
