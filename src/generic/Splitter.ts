import {INode, InPort, Inputs, IPort, OutPort} from "../node";

/**
 * Forwards input to multiple outputs.
 */
export class Splitter<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    [out: string]: IPort<T>
  };
  private readonly count: number;

  /**
   * @param count Number of outputs.
   */
  constructor(count: number = 2) {
    this.ports = {
      in: new InPort(this)
    };
    this.count = count;
    const ports = this.ports;
    for (let i = 1; i <= count; i++) {
      ports[`out${i}`] = new OutPort();
    }
  }

  public send(inputs: Inputs, tag?: string): void {
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
