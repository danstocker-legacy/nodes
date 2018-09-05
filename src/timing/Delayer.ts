import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Forwards input to output with a delay.
 */
export class Delayer<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<T>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;

  constructor(delay: number) {
    this.delay = delay;
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
  }

  public send(inputs: Inputs, tag?: string): void {
    this.timer = setTimeout(
      () => this.ports.out.send(inputs.get(this.ports.in), tag),
      this.delay);
  }
}
