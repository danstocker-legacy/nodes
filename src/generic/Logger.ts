import {InPort, Inputs, Node} from "../node";

/**
 * Logs input to console.
 */
export class Logger extends Node {
  public readonly ports: {
    in: InPort<any>
  };

  constructor() {
    super();
    this.ports = {
      in: new InPort<any>(this)
    };
  }

  protected process(inputs: Inputs, tag?: string): void {
    // tslint:disable:no-console
    console.log(inputs.get(this.ports.in));
  }
}
