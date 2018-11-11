import {INode} from "../node";
import {TOutPort} from "./TOutPort";
import {TPorts} from "./TPorts";

export type TOutPorts<V> = TPorts<V, INode<any, any>, TOutPort<V>>;
