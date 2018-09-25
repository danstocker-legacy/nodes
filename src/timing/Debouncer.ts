import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Forwards batches of input values with debouncing.
 * Batches will be tagged with tag of last input in batch.
 */
export class Debouncer<T> extends NodeBase {
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
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
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
