import {IPort} from "./IPort";
import {INode} from "./INode";
import {OutPort} from "./OutPort";

export class InPort<T> implements IPort<T> {
  public readonly node: INode;
  public peer: OutPort<T>;

  constructor(node: INode) {
    this.node = node;
  }

  public send(value: T): void {
    this.node.in(this, value);
  }
}
