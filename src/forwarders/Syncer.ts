import {SyncerBase} from "../abstracts";
import {InPort, Inputs, OutPort} from "../node";

/**
 * Synchronizes input values from multiple ports into an array on a single port.
 */
export class Syncer extends SyncerBase {
  public readonly in: {
    [key: number]: InPort<any>
  };
  public readonly out: {
    $: OutPort<Array<any>>
  };

  constructor(count: number = 2) {
    super();
    for (let i = 0; i < count; i++) {
      this.openInPort(i);
    }
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag: string) {
    this.out.$.send(Array.from(inputs.values()), tag);
  }
}
