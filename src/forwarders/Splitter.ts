import {InPort, Inputs, IPort, Node, OutPort} from "../node/index";

/**
 * Forwards input to multiple outputs.
 */
export class Splitter<T> extends Node {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    [key: string]: OutPort<T>
  };
  private readonly count: number;

  /**
   * @param count Number of outputs.
   */
  constructor(count: number = 2) {
    super();
    this.count = count;
    this.openInPort("$", new InPort(this));
    for (let i = 1; i <= count; i++) {
      this.openOutPort(`${i}`, new OutPort());
    }
  }

  protected process(inputs: Inputs, tag?: string): void {
    const ports = this.out;
    const count = this.count;
    for (let i = 1; i <= count; i++) {
      const outPort = ports[`${i}`];
      if (outPort) {
        outPort.send(inputs.get(this.in.$), tag);
      }
    }
  }
}
