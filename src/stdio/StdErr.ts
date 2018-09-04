import {INode, InPort, Inputs} from "../node";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr implements INode {
  public readonly ports: {
    in: InPort<string | Buffer>
  };

  constructor() {
    this.ports = {
      in: new InPort(this)
    };
  }

  public send(inputs: Inputs): void {
    process.stderr.write(inputs.get(this.ports.in));
  }
}
