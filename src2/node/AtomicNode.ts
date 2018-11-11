import {IInPort, OutPort, TEventPorts, TInPorts, TOutPorts} from "../port";
import {IAtomicNode} from "./IAtomicNode";
import {INode, TPortEvents} from "./INode";

export abstract class AtomicNode<I, O, E extends string = null>
  implements INode<I, O, E>, IAtomicNode<I> {
  public readonly in: TInPorts<I>;
  public readonly out: TOutPorts<O>;
  public readonly svc: TEventPorts<E | TPortEvents>;

  protected constructor() {
    this.in = <TInPorts<I>> {};
    this.out = <TOutPorts<O>> {};
    this.svc = <TEventPorts<E>> {
      evt: new OutPort("evt", this)
    };
  }

  public abstract send(port: IInPort<I[keyof I]>, value: I[keyof I], tag?: string): void;
}
