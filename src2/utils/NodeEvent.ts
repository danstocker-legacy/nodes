import {IAtomicNode} from "../node";

/**
 * Describes an event value emitted by nodes though the "event" output port.
 * @example
 * const nodeEvent = new NodeEvent("port-add", node, {port});
 */
export class NodeEvent {
  public readonly type: string;
  public readonly node: IAtomicNode;
  public readonly payload?: any;

  constructor(type: string, node: IAtomicNode, payload?: any) {
    this.type = type;
    this.node = node;
    this.payload = payload;
  }
}
