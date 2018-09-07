import {Inputs} from "../node/Inputs";
import {Node} from "../node/Node";

/**
 * Invokes #process with last values on each input port.
 */
export abstract class TrackerBase extends Node {
  private readonly inputs: Inputs;

  protected constructor() {
    super();
    this.inputs = new Map();
  }

  public send(inputs: Inputs, tag?: string) {
    for (const [port, value] of inputs.entries()) {
      this.inputs.set(port, value);
    }
    this.process(this.inputs, tag);
  }
}
