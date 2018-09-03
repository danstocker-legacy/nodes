import {INode, InPort, OutPort} from "../node";

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
      out: new OutPort(this)
    };
    this.pretty = pretty;
  }

  public send(value: I, port: InPort<I>): void {
    if (port === this.ports.in) {
      this.ports.out.send(JSON.stringify(value, null, this.pretty ? 2 : 0));
    }
  }
}
