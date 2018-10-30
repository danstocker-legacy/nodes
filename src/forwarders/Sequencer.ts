import {SequencerBase} from "../abstracts";
import {InPort, Inputs, OutPort} from "../node";

/**
 * Forwards input following a reference order.
 */
export class Sequencer extends SequencerBase {
  public readonly in: {
    ref: InPort<string>,
    [key: number]: InPort<any>
  };
  public readonly out: {
    [key: number]: OutPort<any>
  };
  private readonly lookup: Map<InPort<any>, OutPort<any>>;

  constructor(count: number = 1) {
    super();
    this.lookup = new Map();
    for (let i = 0; i < count; i++) {
      const inPort =  this.openInPort(i);
      const outPort = this.openOutPort(i);
      this.lookup.set(inPort, outPort);
    }
  }

  protected process(inputs: Inputs, tag: string): void {
    const lookup = this.lookup;
    for (const [port, value] of inputs.entries()) {
      const outPort = lookup.get(port);
      outPort.send(value, tag);
    }
  }
}
