import {INode, Port} from "../node";

export class JsonStringifier<I extends Object> implements INode {
  public readonly ports: {
    in: Port<I>,
    out: Port<string>
  };
  private readonly pretty: boolean;

  constructor(pretty: boolean = false) {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<string>(this)
    };
    this.pretty = pretty;
  }

  public in(port: Port<I>, value: I): void {
    if (port === this.ports.in) {
      this.ports.out.out(JSON.stringify(value, null, this.pretty ? 2 : 0));
    }
  }
}