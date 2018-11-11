import {IAtomicNode} from "../node";
import {TInPort} from "./TInPort";
import {TPorts} from "./TPorts";

export type TInPorts<V> = TPorts<V, IAtomicNode<any>, TInPort<V>>;
