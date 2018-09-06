import {Node} from "./Node";
import {Ports} from "./Ports";

/**
 * Groups nodes into a single node.
 * Instantiate directly for ad-hoc super-nodes, subclass for super-nodes
 * that orchestrate their sub-node components.
 */
export class SuperNode extends Node {
  public readonly ports: Ports;

  constructor(ports: Ports) {
    super();
    this.ports = ports;
  }

  protected process() {
    throw Error("Super-node doesn't process input.");
  }
}
