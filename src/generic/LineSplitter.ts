import {INode, InPort, Inputs, OutPort} from "../node";

/**
 * Splits input text and sends individual lines to output.
 */
export class LineSplitter implements INode {
  public readonly ports: {
    in: InPort<string>,
    out: OutPort<string>
  };
  private fragment: string = "";

  constructor() {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
  }

  public send(inputs: Inputs, tag?: string): void {
    const text = this.fragment + inputs.get(this.ports.in);
    const lines = text.split("\n");

    this.fragment = lines.pop();

    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.ports.out.send(lines[i], tag);
    }
  }
}
