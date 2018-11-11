import {AtomicNode} from "../node";
import {IInPort, InPort} from "../port";

/**
 * Forwards input to `process.stderr`.
 */
export class StdErr extends AtomicNode<{
  $: string | Buffer
}, null> {
  constructor() {
    super();
    this.in.$ = new InPort("$", this);
  }

  public send<T>(port: IInPort<T & (string | Buffer)>, input: T & (string | Buffer)): void {
    if (port === this.in.$) {
      process.stderr.write(input);
    }
  }
}
