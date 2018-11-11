import {IInPort, TInPorts, TOutPorts} from "../port";
import {IAtomicNode} from "./IAtomicNode";
import {INode} from "./INode";

export abstract class AtomicNode<I, O> implements INode<I, O>, IAtomicNode {
  public readonly in: TInPorts<I>;
  public readonly out: TOutPorts<O>;

  protected constructor() {
    this.in = <TInPorts<I>> {};
    this.out = <TOutPorts<O>> {};
  }

  public abstract send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
