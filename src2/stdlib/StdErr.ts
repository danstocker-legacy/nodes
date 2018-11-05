import {Node} from "../node";
import {IInPort, StaticInPort, TStaticInPorts} from "../port";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends Node {
  public readonly in: TStaticInPorts<{
    $: string | Buffer
  }>;

  constructor() {
    super();
    this.addPort(new StaticInPort("$", this));
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, value: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stderr.write(value);
    }
  }
}
