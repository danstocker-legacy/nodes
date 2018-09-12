import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards batches of input values with throttling.
 */
export class Throttler<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay: number) {
    super();
    this.openPort("in", new InPort(this));
    this.openPort("out", new OutPort());
    this.delay = delay;
    this.values = [];
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.values.push(inputs.get(this.ports.in));

    const timer = this.timer;
    if (!timer) {
      const onTimeout = () => {
        const values = this.values;
        if (values.length) {
          this.timer = setTimeout(onTimeout, this.delay);
          this.values = [];
          this.ports.out.send(values, tag);
        } else {
          this.timer = undefined;
        }
      };

      this.timer = setTimeout(onTimeout, this.delay);
    }
  }
}
