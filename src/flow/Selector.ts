import {SyncerBase} from "../abstracts";
import {InPort, Inputs, OutPort} from "../node";

/**
 * Forwards default input to output when reference input is truthy.
 */
export class Selector<T> extends SyncerBase {
  public readonly in: {
    ref: InPort<any>,
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };

  constructor() {
    super();
    this.openInPort("ref");
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag: string): void {
    const ref = inputs.get(this.in.ref);
    const value = inputs.get(this.in.$);
    if (ref) {
      this.out.$.send(value, tag);
    }
  }
}
