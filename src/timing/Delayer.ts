import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Forwards input to output with a delay.
 */
export class Delayer<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay: number) {
    super();
    this.delay = delay;
    this.openPort("in", new InPort(this));
    this.openPort("out", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.timer = setTimeout(
      () => this.ports.out.send(inputs.get(this.ports.in), tag),
      this.delay);
  }
}
