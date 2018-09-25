import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Splits input text and sends individual lines to output.
 * Tags output with line index appended to input tag.
 */
export class LineSplitter extends NodeBase {
  public readonly in: {
    $: InPort<string>
  };
  public readonly out: {
    $: OutPort<string>
  };
  private fragment: string = "";

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const text = this.fragment + inputs.get(this.in.$);
    const lines = text.split("\n");

    this.fragment = lines.pop();

    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.out.$.send(lines[i], `${tag}|${i}`);
    }
  }
}
