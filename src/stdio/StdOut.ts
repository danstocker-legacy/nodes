import {InPort, Inputs, Node} from "../node";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut extends Node {
  public readonly ports: {
    in: InPort<string | Buffer>
  };

  constructor() {
    super();
    this.ports = {
      in: new InPort(this)
    };
  }

  protected process(inputs: Inputs): void {
    process.stdout.write(inputs.get(this.ports.in));
  }
}
