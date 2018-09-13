import {SequencerBase} from "../abstracts";
import {InPort, Inputs, OutPort} from "../node";

export class Sequencer extends SequencerBase {
  public readonly in: {
    ref: InPort<string>,
    [key: string]: InPort<any>
  };
  public readonly out: {
    [key: string]: OutPort<any>
  };
  private readonly lookup: Map<InPort<any>, OutPort<any>>;

  constructor(count: number = 1) {
    super();
    this.lookup = new Map();
    this.openInPort("ref", new InPort(this));
    for (let i = 1; i <= count; i++) {
      const inPort = new InPort(this);
      const outPort = new OutPort();
      this.openInPort(`${i}`, inPort);
      this.openOutPort(`${i}`, outPort);
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
