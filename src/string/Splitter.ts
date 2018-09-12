import {InPort, Inputs, IPort, Node, OutPort} from "../node";

/**
 * Forwards input to multiple outputs.
 */
export class Splitter<T> extends Node {
  public readonly ports: {
    in: InPort<T>,
    [key: string]: IPort<T>
  };
  private readonly count: number;

  /**
   * @param count Number of outputs.
   */
  constructor(count: number = 2) {
    super();
    this.count = count;
    this.openPort("in", new InPort(this));
    for (let i = 1; i <= count; i++) {
      this.openPort(`out${i}`, new OutPort());
    }
  }

  protected process(inputs: Inputs, tag?: string): void {
    const ports = this.ports;
    const count = this.count;
    for (let i = 1; i <= count; i++) {
      const outPort = ports[`out${i}`];
      if (outPort) {
        outPort.send(inputs.get(this.ports.in), tag);
      }
    }
  }
}
