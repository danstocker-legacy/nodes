import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Splits input text and sends individual lines to output.
 */
export class LineSplitter extends Node {
  public readonly ports: {
    in: InPort<string>,
    out: OutPort<string>
  };
  private fragment: string = "";

  constructor() {
    super();
    this.ports = {
      in: new InPort(this),
      out: new OutPort()
    };
  }

  protected process(inputs: Inputs, tag?: string): void {
    const text = this.fragment + inputs.get(this.ports.in);
    const lines = text.split("\n");

    this.fragment = lines.pop();

    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.ports.out.send(lines[i], tag);
    }
  }
}
