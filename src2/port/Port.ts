import {IAtomicNode} from "../node";
import {IPort} from "./IPort";

export abstract class Port<T> implements IPort<T> {
  public readonly name: string;
  public readonly node: IAtomicNode;

  protected constructor(name: string, node: IAtomicNode) {
    this.name = name;
    this.node = node;
  }

  public abstract connect(peer: IPort<T>, tag?: string): void;

  public abstract send(value: T, tag?: string): void;
}
