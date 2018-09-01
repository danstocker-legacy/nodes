import {INode, InPort, OutPort} from "../node";

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

  public in(port: InPort<string>, value: string): void {
    if (port === this.ports.in) {
      const text = this.fragment + value;
      const lines = text.split("\n");

      this.fragment = lines.pop();

      const lineCount = lines.length;
      for (let i = 0; i < lineCount; i++) {
        this.ports.out.send(lines[i]);
      }
    }
  }
}
