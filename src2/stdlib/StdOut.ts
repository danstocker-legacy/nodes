import {Node} from "../node";
import {IInPort, InPort, TInPorts} from "../port";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut extends Node {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    super();
    this.addPort(new InPort("$", this));
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
