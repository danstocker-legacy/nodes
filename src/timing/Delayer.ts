import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Forwards input to output with a delay.
 */
export class Delayer<T> extends NodeBase {
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
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.timer = setTimeout(
      () => this.out.$.send(inputs.get(this.in.$), tag),
      this.delay);
  }
}
