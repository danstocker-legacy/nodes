import {INode, Port} from "../node";

export class LineSplitter implements INode {
  public readonly ports: {
    in: Port<string>,
    out: Port<string>
  };

  /**
   * Line fragment from last input.
   */
  private fragment: string = '';

  constructor() {
    this.ports = {
      in: new Port<string>(this),
      out: new Port<string>(this)
    }
  }

  public in(port: Port<string>, value: string): void {
    const text = this.fragment + value;
    const lines = text.split('\n');

    this.fragment = lines.pop();

    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.ports.out.out(lines[i]);
    }
  }
}
