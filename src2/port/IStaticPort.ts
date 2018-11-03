import {IPort} from "./IPort";

export interface IStaticPort<T> extends IPort<T> {
  static: true;
}
