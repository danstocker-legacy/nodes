import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards input to output with a delay.
 */
export class Delayer<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay: number) {
    super();
    this.delay = delay;
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.timer = setTimeout(
      () => this.out.$.send(inputs.get(this.in.$), tag),
      this.delay);
  }
}
