import {INode, InPort} from "../node";

export class Logger implements INode {
  public readonly ports: {
    in: InPort<any>
  };

  constructor() {
    this.ports = {
      in: new InPort<any>(this)
    };
  }

  public send(port: InPort<any>, value: any): void {
    if (port === this.ports.in) {
      console.log(value);
    }
  }
}
