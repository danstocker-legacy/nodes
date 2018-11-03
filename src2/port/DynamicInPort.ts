import {IDynamicPort} from "./IDynamicPort";
import {InPort} from "./InPort";

export class DynamicInPort<T> extends InPort<T> implements IDynamicPort<T> {
  public readonly dynamic: true;
}
