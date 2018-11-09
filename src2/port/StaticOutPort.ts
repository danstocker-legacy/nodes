import {IAtomicNode} from "../node";
import {IStaticPort} from "./IStaticPort";
import {OutPort} from "./OutPort";

export class StaticOutPort<T> extends OutPort<T> implements IStaticPort<T> {
  public readonly static: true;

  constructor(name: string, node: IAtomicNode) {
    super(name, node);
    this.static = true;
  }
}
