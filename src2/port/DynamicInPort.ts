import {IAtomicNode} from "../node";
import {IDynamicPort} from "./IDynamicPort";
import {InPort} from "./InPort";

export class DynamicInPort<T> extends InPort<T> implements IDynamicPort<T> {
  public readonly dynamic: true;

  constructor(name: number, node: IAtomicNode) {
    super(name, node);
    this.dynamic = true;
  }

  public delete(tag?: string): void {
    this.node.deletePort(this, tag);
  }
}
