import {TNode} from "../node";
import {TOutPort} from "./TOutPort";
import {TPorts} from "./TPorts";

/**
 * Defines an output port bundle as having the name / type pairs of the
 * specified interface (I).
 * @example
 * const port: TOutPorts<{foo: number, bar: boolean}>
 */
export type TOutPorts<V> = TPorts<V, TNode, TOutPort<V>>;
