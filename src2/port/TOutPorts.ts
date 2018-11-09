import {TOutPort} from "./TOutPort";
import {TPorts} from "./TPorts";

export type TOutPorts<V> = TPorts<TOutPort<V>, V>;
