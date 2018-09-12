import {Node} from "./Node";
import {Ports} from "./Ports";

/**
 * Groups nodes into a single node.
 * Instantiate directly for ad-hoc super-nodes, subclass for super-nodes
 * that orchestrate their sub-node components.
 */
export class SuperNode extends Node {
  constructor(inPorts?: Ports, outPorts?: Ports) {
    super();
    if (inPorts) {
      // tslint:disable:forin
      for (const name in inPorts) {
        this.openPort(name, inPorts[name]);
      }
      // tslint:disable:forin
      for (const name in outPorts) {
        this.openPort(name, outPorts[name]);
      }
    }
  }

  protected process() {
    throw Error("Super-node doesn't process input.");
  }
}
