import {IPort} from "./IPort";

export interface IOutPort<T> extends IPort<T> {
  out: true;
}
