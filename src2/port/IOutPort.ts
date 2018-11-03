import {IInPort} from "./IInPort";
import {IPort} from "./IPort";

export interface IOutPort<T> extends IPort<T> {
  out: true;

  connect(peer: IInPort<T>, tag?: string): void;

  disconnect(peer?: IInPort<T>, tag?: string): void;
}
