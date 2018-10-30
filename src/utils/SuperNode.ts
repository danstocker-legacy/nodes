import {InPorts, NodeBase, OutPorts} from "../node";

/**
 * Groups nodes into a single ad-hoc node.
 */
export class SuperNode extends NodeBase {
  constructor(inPorts?: InPorts, outPorts?: OutPorts) {
    super();
    if (inPorts) {
      // tslint:disable:forin
      for (const name in inPorts) {
        this.in[name] = inPorts[name];
      }
      // tslint:disable:forin
      for (const name in outPorts) {
        this.out[name] = outPorts[name];
      }
    }
  }

  protected process() {
    throw Error("Super-node doesn't process input.");
  }
}
