import {INode} from "./INode";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";

/**
 * Input port for nodes.
 */
export class InPort<T> implements IPort<T> {
  public readonly node: INode;
  public peer: OutPort<T>;

  constructor(node: INode) {
    this.node = node;
  }

  /**
   * Sends data to the current port.
   */
  public send(value: T, timestamp?: number): void {
    this.node.send(value, this, timestamp);
  }
}