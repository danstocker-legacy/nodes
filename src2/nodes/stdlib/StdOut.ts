import {ISink, Sink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

interface IStdOutInputs {
  $: string | Buffer;
}

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink {
  public readonly in: TInPorts<IStdOutInputs>;

  constructor() {
    Sink.init.call(this);
    this.in.$ = new InPort("$", this);
  }

  public send(port: IInPort<string | Buffer>, input: string | Buffer): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
