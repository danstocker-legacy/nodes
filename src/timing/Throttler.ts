import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards batches of input values with throttling.
 * Batches will be tagged with tag of last input in batch.
 */
export class Throttler<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay: number) {
    super();
    this.delay = delay;
    this.values = [];
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.values.push(inputs.get(this.in.$));

    const timer = this.timer;
    if (!timer) {
      const onTimeout = () => {
        const values = this.values;
        if (values.length) {
          this.timer = setTimeout(onTimeout, this.delay);
          this.values = [];
          this.out.$.send(values, tag);
        } else {
          this.timer = undefined;
        }
      };

      this.timer = setTimeout(onTimeout, this.delay);
    }
  }
}
