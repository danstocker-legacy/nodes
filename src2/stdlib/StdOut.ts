import {Node} from "../node";
import {IInPort, StaticInPort, TStaticInPorts} from "../port";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut extends Node {
  public readonly in: TStaticInPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("$", this));
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
