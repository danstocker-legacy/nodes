import {InPort, Inputs, NodeBase} from "../node";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends NodeBase {
  public readonly in: {
    $: InPort<string | Buffer>
  };

  constructor() {
    super();
    this.openInPort("$");
  }

  protected process(inputs: Inputs): void {
    process.stderr.write(inputs.get(this.in.$));
  }
}
