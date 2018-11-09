import {TInPort} from "./TInPort";
import {TPorts} from "./TPorts";

export type TInPorts<V> = TPorts<TInPort<V>, V>;
