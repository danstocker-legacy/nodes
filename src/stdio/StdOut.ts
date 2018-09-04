import {INode, InPort, Inputs} from "../node";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements INode {
  public readonly ports: {
    in: InPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new InPort(this)
    };
  }

  public send(inputs: Inputs): void {
    process.stdout.write(inputs.get(this.ports.in));
  }
}
