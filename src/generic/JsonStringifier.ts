import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Sends object input to output as JSON string.
 */
export class JsonStringifier<I extends object> implements INode {
  public readonly ports: {
    in: InPort<I>,
    out: OutPort<string>
  };
  private readonly pretty: boolean;

  constructor(pretty: boolean = false) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.pretty = pretty;
  }

  public send(inputs: Inputs, tag?: string): void {
    this.ports.out.send(
      JSON.stringify(inputs.get(this.ports.in), null, this.pretty ? 2 : 0),
      tag);
  }
}
