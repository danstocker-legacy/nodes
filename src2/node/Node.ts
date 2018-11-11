import {OutPort, TEventPorts, TInPorts, TOutPorts} from "../port";
import {INode, TPortEvents} from "./INode";

export abstract class Node<I, O, E extends string = null> implements INode<I, O, E> {
  public in: TInPorts<I>;
  public out: TOutPorts<O>;
  public readonly svc: TEventPorts<E | TPortEvents>;

  protected constructor() {
    this.in = <TInPorts<I>> {};
    this.out = <TOutPorts<O>> {};
    this.svc = {
      evt: new OutPort("evt", this)
    };
  }
}
