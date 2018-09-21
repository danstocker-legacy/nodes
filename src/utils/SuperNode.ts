import {InPorts, Node, OutPorts} from "../node";

/**
 * Groups nodes into a single ad-hoc node.
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
