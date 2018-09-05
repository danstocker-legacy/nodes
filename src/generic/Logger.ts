import {INode, InPort, Inputs} from "../node";

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

  public send(inputs: Inputs, tag?: string): void {
    /* tslint:disable:no-console */
    console.log(inputs.get(this.ports.in));
  }
}
