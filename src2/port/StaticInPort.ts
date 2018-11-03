import {INode} from "../node";
import {InPort} from "./InPort";
import {IStaticPort} from "./IStaticPort";

export class StaticInPort<T> extends InPort<T> implements IStaticPort<T> {
  public readonly static: true;

  constructor(name: string, node: INode) {
    super(name, node);
    this.static = true;
  }
}
