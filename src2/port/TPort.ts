import {IPort} from "./IPort";

export type TPort<V> = IPort<V[keyof V]>;
