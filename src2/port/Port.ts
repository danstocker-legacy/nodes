import {INode} from "../node";
import {IPort} from "./IPort";

export abstract class Port<N extends INode<any, any>, T> implements IPort<N, T> {
  public readonly name: string;
  public readonly node: N;

  protected constructor(name: string, node: N) {
    this.name = name;
    this.node = node;
  }

  public abstract connect(peer: IPort<INode<any, any>, T>, tag?: string): void;

  public abstract send(value: T, tag?: string): void;
}
