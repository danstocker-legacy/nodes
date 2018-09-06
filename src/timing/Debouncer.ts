import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards batches of input values with debouncing.
 */
export class Debouncer<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<T>;

  constructor(delay: number) {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
    this.delay = delay;
    this.values = [];
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.values.push(inputs.get(this.ports.in));

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    const onTimeout = () => {
      const values = this.values;
      this.timer = undefined;
      this.values = [];
      this.ports.out.send(values, tag);
    };

    this.timer = setTimeout(onTimeout, this.delay);
  }
}
