import {INode} from "./INode";

export class Port<T> {
  public readonly node: INode;
  // TODO: Change terminology? sender / receiver
  public readonly inputs: Array<Port<T>>;
  public readonly outputs: Array<Port<T>>;

  constructor(node: INode) {
    this.node = node;
    this.inputs = [];
    this.outputs = [];
  }

  public connect(port: Port<T>) {
    this.outputs.push(port);
    port.inputs.push(this);
  }

  public in(value: T): void {
    this.node.in(this, value);
  }

  public out(value: T): void {
    const outputs = this.outputs;
    const outputCount = outputs.length;
    for (let i = 0; i < outputCount; i++) {
      const output = outputs[i];
      output.in["origin"] = this;
      output.in(value);
    }
  }
}
