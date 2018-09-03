import {INode} from "./INode";
import {InPort} from "./InPort";
import {Ports} from "./Ports";

/**
 * Groups nodes into a single node.
 * Instantiate directly for ad-hoc super-nodes, subclass for super-nodes
 * that orchestrate their sub-node components.
 */
export class SuperNode implements INode {
  public readonly ports: Ports;

  constructor(ports: Ports) {
    this.ports = ports;
  }

  public send(value: any, port: InPort<any>) {
    throw Error("Super-node doesn't process input.");
  }
}
