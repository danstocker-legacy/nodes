import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Forwards input to output.
 */
export class Noop<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };

  constructor() {
    super();
    this.openInPort("$");
    this.openOutPort("$");
  }

  public sendInput(port: InPort<T>, value: T, tag?: string): void {
    if (port === this.in.$) {
      this.out.$.send(value, tag);
    }
  }
}
