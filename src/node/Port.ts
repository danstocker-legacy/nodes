import {INode} from "./INode";

export class Port<T> {
  public readonly node: INode;
  public readonly inputs: Array<Port<T>>;
  public readonly outputs: Array<Port<T>>;

  constructor(node: INode) {
    this.node = node;
    this.inputs = [];
    this.outputs = [];
  }

  public in(value: T): void {
    this.node.in(this, value);
  }

  public out(value: T): void {
    const outputs = this.outputs;
    const outputCount = outputs.length;
    for (let i = 0; i < outputCount; i++) {
      const peer = outputs[i];
      peer.in["origin"] = this;
      peer.in(value);
    }
  }

  public connect(port: Port<T>) {
    this.outputs.push(port);
    port.inputs.push(this);
  }
}
