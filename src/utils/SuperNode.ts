import {InPorts} from "../node/InPorts";
import {Node} from "../node/Node";
import {OutPorts} from "../node/OutPorts";

/**
 * Groups nodes into a single node.
 * Instantiate directly for ad-hoc super-nodes, subclass for super-nodes
 * that orchestrate their sub-node components.
 */
export class SuperNode extends Node {
  constructor(inPorts?: InPorts, outPorts?: OutPorts) {
    super();
    if (inPorts) {
      // tslint:disable:forin
      for (const name in inPorts) {
        this.openInPort(name, inPorts[name]);
      }
      // tslint:disable:forin
      for (const name in outPorts) {
        this.openOutPort(name, outPorts[name]);
      }
    }
  }

  protected process() {
    throw Error("Super-node doesn't process input.");
  }
}