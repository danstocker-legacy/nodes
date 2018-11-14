import {ISink, Node, Sink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends Node implements ISink {
  public readonly in: TInPorts<{
    $: string | Buffer;
  }>;

  constructor() {
    super();
    Sink.init.call(this);
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
