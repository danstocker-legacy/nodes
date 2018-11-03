import {IStaticPort} from "./IStaticPort";
import {OutPort} from "./OutPort";

export class StaticOutPort<T> extends OutPort<T> implements IStaticPort<T> {
  public readonly static: true;
}
