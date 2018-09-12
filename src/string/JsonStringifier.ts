import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Sends object input to output as JSON string.
 */
export class JsonStringifier<I extends object> extends Node {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<string>
  };
  private readonly pretty: boolean;

  constructor(pretty: boolean = false) {
    super();
    this.pretty = pretty;
    this.openPort("in", new InPort(this));
    this.openPort("out", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.ports.out.send(
      JSON.stringify(inputs.get(this.ports.in), null, this.pretty ? 2 : 0),
      tag);
  }
}
