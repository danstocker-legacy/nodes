import {IInPort, IOutPort, IPort, TInPorts, TOutPorts} from "../port";
import {IAtomicNode} from "./IAtomicNode";

export abstract class Node implements IAtomicNode {
  public readonly in: TInPorts<any>;
  public readonly out: TOutPorts<any>;

  protected constructor() {
    this.in = {};
    this.out = {};
  }

  public abstract send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
