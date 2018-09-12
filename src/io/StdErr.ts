import {InPort, Inputs, Node} from "../node";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends Node {
  public readonly in: {
    $: InPort<string | Buffer>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs): void {
    process.stderr.write(inputs.get(this.in.$));
  }
}
