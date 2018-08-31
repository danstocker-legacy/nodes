import {INode} from "./INode";

export class Port<T> {
  public readonly node: INode;
  public readonly sources: Array<Port<T>>;
  public readonly destinations: Array<Port<T>>;

  constructor(node: INode) {
    this.node = node;
    this.sources = [];
    this.destinations = [];
  }

  public connect(destination: Port<T>) {
    this.destinations.push(destination);
    destination.sources.push(this);
  }

  public in(value: T): void {
    this.node.in(this, value);
  }

  public out(value: T): void {
    const destinations = this.destinations;
    const destinationCount = destinations.length;
    for (let i = 0; i < destinationCount; i++) {
      const destination = destinations[i];
      destination.in["source"] = this;
      destination.in(value);
    }
  }
}
