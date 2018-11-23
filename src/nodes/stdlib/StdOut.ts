import {ISink, MSink} from "../../node";
import {IInPort, TInPorts} from "../../port";

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    MSink.init.call(this, ["$"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
