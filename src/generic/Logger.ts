import {INode, InPort} from "../node";

/**
 * Logs input to console.
 */
export class Logger implements INode {
  public readonly ports: {
    in: InPort<any>
  };

  constructor() {
    this.ports = {
      in: new InPort<any>(this)
    };
  }

  public send(value: any, port: InPort<any>): void {
    if (port === this.ports.in) {
      /* tslint:disable:no-console */
      console.log(value);
    }
  }
}
