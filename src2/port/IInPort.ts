import {IOutPort} from "./IOutPort";
import {IPort} from "./IPort";

export interface IInPort<T> extends IPort<T> {
  in: true;
  peer: IOutPort<T>;

  connect(peer: IOutPort<T>, tag?: string): void;

  disconnect(tag?: string): void;
}
