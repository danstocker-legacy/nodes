import {ISink, Sink} from "../../node";
import {IInPort, TInPorts} from "../../port";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr implements ISink {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    Sink.init.call(this, ["$"]);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
