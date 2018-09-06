import {INode} from "./INode";
import {IPort} from "./IPort";

/**
 * Input port for nodes.
 */
export class InPort<T> implements IPort<T> {
  public readonly node: INode;

  constructor(node: INode) {
    this.node = node;
  }

  public send(value: T, tag?: string): void {
    this.node.send(new Map([[this, value]]), tag);
  }
}
