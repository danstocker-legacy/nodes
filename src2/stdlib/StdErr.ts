import {Node} from "../node";
import {IInPort, InPort, TInPorts} from "../port";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends Node {
  public readonly in: TInPorts<{
    $: string | Buffer
  }>;

  constructor() {
    super();
    this.addPort(new InPort("$", this));
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
