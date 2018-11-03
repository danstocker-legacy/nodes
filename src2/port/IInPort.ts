import {IPort} from "./IPort";

export interface IInPort<T> extends IPort<T> {
  in: true;
}
