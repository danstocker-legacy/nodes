import {IDynamicPort} from "./IDynamicPort";
import {OutPort} from "./OutPort";

export class DynamicOutPort<T> extends OutPort<T> implements IDynamicPort<T> {
  public readonly dynamic: true;
}
