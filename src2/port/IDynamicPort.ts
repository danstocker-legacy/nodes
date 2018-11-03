import {IPort} from "./IPort";

export interface IDynamicPort<T> extends IPort<T> {
  dynamic: true;

  delete(tag?: string): void;
}
