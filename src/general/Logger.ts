import {INode, Port} from "../node";

export class Logger implements INode {
  public readonly ports: {
    in: Port<any>
  };

  constructor() {
    this.ports = {
      in: new Port<any>(this)
    };
  }

  public in(port: Port<any>, value: any): void {
    if (port === this.ports.in) {
      console.log(value);
    }
  }
}
