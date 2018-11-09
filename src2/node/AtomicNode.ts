import {IInPort, TInPorts, TOutPorts} from "../port";
import {IAtomicNode} from "./IAtomicNode";

export abstract class AtomicNode implements IAtomicNode {
  public readonly in: TInPorts<any>;
  public readonly out: TOutPorts<any>;

  protected constructor() {
    this.in = {};
    this.out = {};
  }

  public abstract send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
