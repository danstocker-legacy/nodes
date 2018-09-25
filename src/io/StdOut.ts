import {InPort, Inputs, NodeBase} from "../node";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut extends NodeBase {
  public readonly in: {
    $: InPort<string | Buffer>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs): void {
    process.stdout.write(inputs.get(this.in.$));
  }
}
