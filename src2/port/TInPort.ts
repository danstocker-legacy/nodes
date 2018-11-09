import {IInPort} from "./IInPort";

export type TInPort<V> = IInPort<V[keyof V]>;
