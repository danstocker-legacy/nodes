import {ISink} from "../../node";
import {IInPort, InPort, TInPorts} from "../../port";

interface IStdOutInputs {
  $: string | Buffer;
}

/**
 * Forwards input to `process.stdout`.
 */
export class StdOut implements ISink<IStdOutInputs> {
  public readonly in: TInPorts<IStdOutInputs>;

  constructor() {
    this.in = {
      $: new InPort("$", this)
    };
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stdout.write(input);
    }
  }
}
