import {InPort, Inputs, Node, OutPort} from "../node/index";

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
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.pretty = pretty;
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.ports.out.send(
      JSON.stringify(inputs.get(this.ports.in), null, this.pretty ? 2 : 0),
      tag);
  }
}
