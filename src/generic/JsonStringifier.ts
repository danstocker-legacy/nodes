import {INode, InPort, OutPort} from "../node";

export class JsonStringifier<I extends Object> implements INode {
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

  public send(port: InPort<I>, value: I): void {
    if (port === this.ports.in) {
      this.ports.out.send(JSON.stringify(value, null, this.pretty ? 2 : 0));
    }
  }
}
