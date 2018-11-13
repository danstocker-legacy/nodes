import {ISink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

interface IStdErrInputs {
  $: string | Buffer;
}

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr implements ISink<IStdErrInputs> {
  public readonly in: TInPorts<IStdErrInputs>;

  constructor() {
    this.in = {
      $: new InPort("$", this)
    };
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
