import {TPort} from "./TPort";

export type TPorts<P extends TPort<V>, V> = {
  [K in keyof V]: P
};
