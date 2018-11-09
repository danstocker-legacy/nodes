import {IOutPort} from "./IOutPort";

export type TOutPort<V> = IOutPort<V[keyof V]>;
