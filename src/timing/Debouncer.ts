import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards batches of input values with debouncing.
 */
export class Debouncer<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<T>;

  constructor(delay: number) {
    super();
    this.delay = delay;
    this.values = [];
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.values.push(inputs.get(this.in.$));

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    const onTimeout = () => {
      const values = this.values;
      this.timer = undefined;
      this.values = [];
      this.out.$.send(values, tag);
    };

    this.timer = setTimeout(onTimeout, this.delay);
  }
}
